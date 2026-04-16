const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/listdir', (req, res) => {
  const dir = req.query.dir;

  if (!dir || !fs.existsSync(dir)) {
    return res.status(400).json({ error: 'Invalid directory' });
  }

  fs.readdir(dir, { withFileTypes: true }, (err, items) => {
    if (err) return res.status(500).json({ error: 'Error reading directory' });

    const dirs = items.filter(i => i.isDirectory()).map(i => i.name).sort();
    const files = items.filter(i => i.isFile() && i.name.endsWith('.mid.txt')).map(i => i.name).sort();
    res.json({ dirs, files });
  });
});

app.post('/extract', (req, res) => {
  const { filePath, leftBar, rightBar, outputName, outputDir } = req.body;

  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(400).json({ error: 'Invalid file path' });
  }

  if (!outputDir || !fs.existsSync(outputDir)) {
    return res.status(400).json({ error: 'Invalid output directory' });
  }

  const left = parseInt(leftBar);
  const right = parseInt(rightBar);

  if (isNaN(left) || isNaN(right) || left < 1 || right < 1 || left > right) {
    return res.status(400).json({ error: 'Invalid bar positions' });
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading file' });

    const tokens = data.trim().split(/\s+/);
    const barEnds = [];
    tokens.forEach((token, index) => {
      if (token === 'b-1') barEnds.push(index);
    });

    if (barEnds.length < right) {
      return res.status(400).json({ error: 'Not enough bars in file' });
    }

    // Calculate start and end indices
    let startIndex = 0;
    if (left > 1) startIndex = barEnds[left - 2] + 1;
    let endIndex = barEnds[right - 1];

    const extracted = tokens.slice(startIndex, endIndex + 1).join(' ');

    const outputPath = path.join(outputDir, outputName);
    fs.writeFile(outputPath, extracted, (err) => {
      if (err) return res.status(500).json({ error: 'Error writing file' });

      res.json({ message: `File saved to ${outputPath}` });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});