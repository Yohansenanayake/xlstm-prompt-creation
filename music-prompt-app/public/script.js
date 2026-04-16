let currentDir = '/home/yohan/backup/TOKEN_PROMPT';
let selectedFilePath = '';

document.getElementById('outputDir').value = currentDir;

// Modal elements
const fileModal = document.getElementById('fileModal');
const dirModal = document.getElementById('dirModal');
const closeFileModal = document.getElementById('closeFileModal');
const closeDirModal = document.getElementById('closeDirModal');

// Open modals
document.getElementById('selectFileBtn').onclick = () => {
  loadModalDir(currentDir, 'file');
  fileModal.style.display = 'block';
};

document.getElementById('selectOutputDirBtn').onclick = () => {
  loadModalDir(currentDir, 'dir');
  dirModal.style.display = 'block';
};

// Close modals
closeFileModal.onclick = () => fileModal.style.display = 'none';
closeDirModal.onclick = () => dirModal.style.display = 'none';

window.onclick = (event) => {
  if (event.target == fileModal) fileModal.style.display = 'none';
  if (event.target == dirModal) dirModal.style.display = 'none';
};

// Load modal directory
async function loadModalDir(dir, type) {
  const currentSpan = type === 'file' ? document.getElementById('currentDirModal') : document.getElementById('currentDirDirModal');
  currentSpan.textContent = dir;

  try {
    const res = await fetch(`/listdir?dir=${encodeURIComponent(dir)}`);
    const data = await res.json();

    if (res.ok) {
      const dirsDiv = type === 'file' ? document.getElementById('dirsModal') : document.getElementById('dirsDirModal');
      dirsDiv.innerHTML = '<h4>Directories:</h4>';
      data.dirs.forEach(d => {
        const btn = document.createElement('button');
        btn.textContent = d;
        btn.onclick = () => loadModalDir(`${dir}/${d}`, type);
        dirsDiv.appendChild(btn);
        dirsDiv.appendChild(document.createElement('br'));
      });

      if (type === 'file') {
        const filesDiv = document.getElementById('filesModal');
        filesDiv.innerHTML = '<h4>Files:</h4>';
        const search = document.getElementById('searchModal').value.toLowerCase();
        const filteredFiles = data.files.filter(f => f.toLowerCase().includes(search));
        if (filteredFiles.length === 0) {
          filesDiv.appendChild(document.createTextNode('No matching files.'));
        } else {
          filteredFiles.forEach(f => {
            const btn = document.createElement('button');
            btn.textContent = f;
            btn.onclick = () => {
              selectedFilePath = `${dir}/${f}`;
              document.getElementById('selectedFile').textContent = `Selected: ${f}`;
              fileModal.style.display = 'none';
            };
            filesDiv.appendChild(btn);
            filesDiv.appendChild(document.createElement('br'));
          });
        }
      }
    } else {
      alert(data.error);
    }
  } catch (error) {
    alert('Error loading directory.');
  }
}

// Up buttons
document.getElementById('upModal').onclick = () => {
  const current = document.getElementById('currentDirModal').textContent;
  const parent = current.split('/').slice(0, -1).join('/');
  if (parent) loadModalDir(parent, 'file');
};

document.getElementById('upDirModal').onclick = () => {
  const current = document.getElementById('currentDirDirModal').textContent;
  const parent = current.split('/').slice(0, -1).join('/');
  if (parent) loadModalDir(parent, 'dir');
};

// Search in modal
document.getElementById('searchModal').addEventListener('input', () => {
  const current = document.getElementById('currentDirModal').textContent;
  loadModalDir(current, 'file');
});

// Select dir
document.getElementById('selectDirBtn').onclick = () => {
  const selectedDir = document.getElementById('currentDirDirModal').textContent;
  document.getElementById('outputDir').value = selectedDir;
  dirModal.style.display = 'none';
};

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!selectedFilePath) {
    document.getElementById('result').textContent = 'Please select an input file.';
    document.getElementById('result').className = 'error';
    return;
  }

  const leftBar = document.getElementById('leftBar').value;
  const rightBar = document.getElementById('rightBar').value;
  const outputName = document.getElementById('outputName').value.trim();
  const outputDir = document.getElementById('outputDir').value.trim();

  if (!outputName || !outputDir) {
    document.getElementById('result').textContent = 'Please enter output filename and directory.';
    document.getElementById('result').className = 'error';
    return;
  }

  try {
    const res = await fetch('/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath: selectedFilePath, leftBar, rightBar, outputName, outputDir })
    });
    const data = await res.json();

    if (res.ok) {
      document.getElementById('result').textContent = data.message;
      document.getElementById('result').className = 'success';
    } else {
      document.getElementById('result').textContent = data.error;
      document.getElementById('result').className = 'error';
    }
  } catch (error) {
    document.getElementById('result').textContent = 'Error extracting tokens.';
    document.getElementById('result').className = 'error';
  }
});