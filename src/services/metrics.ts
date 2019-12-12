import * as client from 'prom-client';

interface HistogramOptions {
  buckets?: number[],
  labelNames?: string[]
}

interface CounterOptions {
  labelNames?: string[]
}

interface MetricsMap {
  [key: string]: client.Metric | undefined
}

function isHistogram(metric: client.Metric): metric is client.Histogram {
  return (metric as client.Histogram).startTimer !== undefined;
}

function isCounter(metric: client.Metric): metric is client.Counter {
  return (metric as client.Counter).inc !== undefined;
}

function getMetricsKey(metricsName: string, labels: string[] | undefined): string {
  const key = [metricsName].concat(labels || []).join('||');

  return key;
}

const metricsMap: MetricsMap = {};

client.register.setDefaultLabels({
  serviceName: 'paystack-project',
})

export function getHistogram(name: string, help: string, options: HistogramOptions = {}): client.Histogram {
  const histogramKey = getMetricsKey(name, options.labelNames);

  let histogram = metricsMap[histogramKey];
  if (histogram && isHistogram(histogram)) { return histogram; }

  histogram = new client.Histogram({
    name,
    help,
    buckets: options.buckets || [0.5, 1, 2, 5, 10],
    labelNames: options.labelNames,
  });

  metricsMap[histogramKey] = histogram;

  return histogram;
}

export function getCounter(name: string, help: string, options: CounterOptions = {}): client.Counter {
  const counterKey = getMetricsKey(name, options.labelNames);

  let counter = metricsMap[counterKey];

  if (counter && isCounter(counter)) { return counter; }

  counter = new client.Counter({
    name,
    help,
    labelNames: options.labelNames,
  });

  metricsMap[counterKey] = counter;

  return counter;
}
