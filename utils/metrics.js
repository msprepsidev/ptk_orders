const express = require('express');
const promClient = require('prom-client');

const app = express();
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestDurationMicroseconds = new promClient.Histogram({
    name: 'http_request_duration_ms',
    help: 'Durée des requêtes HTTP en millisecondes',
    labelNames: ['method', 'route', 'code'],
    buckets: [50, 100, 200, 300, 400, 500]
});
register.registerMetric(httpRequestDurationMicroseconds);

// Middleware pour mesurer la durée des requêtes
app.use((req, res, next) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
        end({ method: req.method, route: req.route ? req.route.path : '', code: res.statusCode });
    });
    next();
});

// Route pour exposer les métriques
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

module.exports = { app, register };
