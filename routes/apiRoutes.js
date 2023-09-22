const express = require('express');
const sanitizeHtml = require('sanitize-html');
const router = express.Router();


router.get('/courses', (req, res) => {
    req.pool.query('SELECT * FROM course', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});


router.get('/course_streams', (req, res) => {
    req.pool.query('SELECT * FROM course_stream ORDER BY stream_id ASC', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});


router.get('/degrees', (req, res) => {
    req.pool.query('SELECT * FROM degree', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

router.get('/degree_levels', (req, res) => {
    req.pool.query('SELECT * FROM degree_level ORDER BY level ASC', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

router.get('/degree_courses/:degree_id', (req, res) => {
    var degreeId = sanitizeHtml(req.params.degree_id);
    req.pool.query('SELECT * FROM degree_course WHERE degree_id = ?', [degreeId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});


router.get('/pre_requisites/:course_id', (req, res) => {
    var courseId = sanitizeHtml(req.params.course_id);
    req.pool.query('SELECT * FROM pre_requisite WHERE src_course_id = ?', [courseId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});


router.get('/incompatibles/:course_id', (req, res) => {
    var courseId = sanitizeHtml(req.params.course_id);
    req.pool.query('SELECT * FROM incompatiable WHERE src_course_id = ?', [courseId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
