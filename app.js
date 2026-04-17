/**
 * FileBox by BlackFish
 * Browser-based file processing toolkit
 */

// ================================
// DOM ELEMENTS
// ================================

// Header & Navigation
var header = document.getElementById('header');
var hamburger = document.getElementById('hamburger');
var navMobile = document.getElementById('navMobile');
var navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');

// Tool Tabs & Panels
var toolTabs = document.querySelectorAll('.tool-tab');
var toolPanels = document.querySelectorAll('.tool-panel');

// Compressor Elements
var compressorDropzone = document.getElementById('compressor-dropzone');
var compressorInput = document.getElementById('compressor-input');
var compressorOptions = document.getElementById('compressor-options');
var compressorFilename = document.getElementById('compressor-filename');
var compressorFilesize = document.getElementById('compressor-filesize');
var compressorRemove = document.getElementById('compressor-remove');
var compressorTarget = document.getElementById('compressor-target');
var compressorHint = document.getElementById('compressor-hint');
var compressorWarning = document.getElementById('compressor-warning');
var compressorProcess = document.getElementById('compressor-process');
var compressorProgress = document.getElementById('compressor-progress');
var compressorPercent = document.getElementById('compressor-percent');
var compressorFill = document.getElementById('compressor-fill');
var compressorResult = document.getElementById('compressor-result');
var compressorOriginal = document.getElementById('compressor-original');
var compressorCompressed = document.getElementById('compressor-compressed');
var compressorSaved = document.getElementById('compressor-saved');
var compressorDownload = document.getElementById('compressor-download');
var compressorReset = document.getElementById('compressor-reset');

// Expander Elements
var expanderDropzone = document.getElementById('expander-dropzone');
var expanderInput = document.getElementById('expander-input');
var expanderOptions = document.getElementById('expander-options');
var expanderFilename = document.getElementById('expander-filename');
var expanderFilesize = document.getElementById('expander-filesize');
var expanderRemove = document.getElementById('expander-remove');
var expanderTarget = document.getElementById('expander-target');
var expanderHint = document.getElementById('expander-hint');
var expanderWarning = document.getElementById('expander-warning');
var expanderProcess = document.getElementById('expander-process');
var expanderProgress = document.getElementById('expander-progress');
var expanderPercent = document.getElementById('expander-percent');
var expanderFill = document.getElementById('expander-fill');
var expanderResult = document.getElementById('expander-result');
var expanderOriginalEl = document.getElementById('expander-original');
var expanderExpanded = document.getElementById('expander-expanded');
var expanderDownload = document.getElementById('expander-download');
var expanderReset = document.getElementById('expander-reset');

// Converter Elements
var converterDropzone = document.getElementById('converter-dropzone');
var converterInput = document.getElementById('converter-input');
var converterOptions = document.getElementById('converter-options');
var converterFilename = document.getElementById('converter-filename');
var converterFilesize = document.getElementById('converter-filesize');
var converterRemove = document.getElementById('converter-remove');
var converterFormats = document.getElementById('converter-formats');
var converterWarning = document.getElementById('converter-warning');
var converterProcess = document.getElementById('converter-process');
var converterProgress = document.getElementById('converter-progress');
var converterPercent = document.getElementById('converter-percent');
var converterFill = document.getElementById('converter-fill');
var converterResult = document.getElementById('converter-result');
var converterFrom = document.getElementById('converter-from');
var converterTo = document.getElementById('converter-to');
var converterPreviewOutput = document.getElementById('converter-preview-output');
var converterPreviewImg = document.getElementById('converter-preview-img');
var converterDownload = document.getElementById('converter-download');
var converterReset = document.getElementById('converter-reset');

// ================================
// STATE
// ================================

var compressorFile = null;
var compressorOutputBlob = null;

var expanderFile = null;
var expanderOutputBlob = null;

var converterFile = null;
var converterOutputBlob = null;
var converterOutputBlobs = null;
var converterSelectedFormat = null;

// FIX #1: Multiple images for JPG→PDF
var converterMultipleFiles = null;

// ================================
// UTILITY FUNCTIONS
// ================================

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function formatFileSizeKB(bytes) {
    return (bytes / 1024).toFixed(1) + ' KB';
}

function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

function getFileNameWithoutExt(filename) {
    return filename.substring(0, filename.lastIndexOf('.')) || filename;
}

function sleep(ms) {
    return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
}

// ================================
// HEADER & NAVIGATION
// ================================

window.addEventListener('scroll', function() {
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
    navMobile.classList.toggle('active');
});

navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMobile.classList.remove('active');
        
        navLinks.forEach(function(l) { l.classList.remove('active'); });
        
        var href = this.getAttribute('href');
        navLinks.forEach(function(l) {
            if (l.getAttribute('href') === href) {
                l.classList.add('active');
            }
        });
    });
});

// ================================
// TOOL TABS
// ================================

toolTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
        var tool = this.dataset.tool;
        
        toolTabs.forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        
        toolPanels.forEach(function(panel) {
            panel.classList.remove('active');
            if (panel.id === 'panel-' + tool) {
                panel.classList.add('active');
            }
        });
    });
});

// ================================
// DRAG & DROP HELPERS
// ================================

function setupDropzone(dropzone, input, callback) {
    dropzone.addEventListener('click', function(e) {
        if (e.target === input) return;
        input.click();
    });
    
    dropzone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });
    
    dropzone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dropzone.classList.remove('dragover');
    });
    
    dropzone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        
        var files = e.dataTransfer.files;
        if (files.length > 0) {
            callback(files[0]);
        }
    });
    
    input.addEventListener('change', function() {
        if (this.files.length > 0) {
            callback(this.files[0]);
        }
    });
}

// Special dropzone for converter that supports multiple files
function setupConverterDropzone(dropzone, input, callback, multiCallback) {
    dropzone.addEventListener('click', function(e) {
        if (e.target === input) return;
        input.click();
    });
    
    dropzone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });
    
    dropzone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dropzone.classList.remove('dragover');
    });
    
    dropzone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        
        var files = e.dataTransfer.files;
        if (files.length > 1) {
            // Check if all are images
            var allImages = Array.from(files).every(function(f) {
                var ext = getFileExtension(f.name);
                return ['jpg', 'jpeg', 'png'].includes(ext);
            });
            if (allImages && multiCallback) {
                multiCallback(Array.from(files));
            } else if (files.length > 0) {
                callback(files[0]);
            }
        } else if (files.length > 0) {
            callback(files[0]);
        }
    });
    
    input.addEventListener('change', function() {
        if (this.files.length > 1) {
            var allImages = Array.from(this.files).every(function(f) {
                var ext = getFileExtension(f.name);
                return ['jpg', 'jpeg', 'png'].includes(ext);
            });
            if (allImages && multiCallback) {
                multiCallback(Array.from(this.files));
            } else if (this.files.length > 0) {
                callback(this.files[0]);
            }
        } else if (this.files.length > 0) {
            callback(this.files[0]);
        }
    });
}

// ================================
// COMPRESSOR
// ================================

function handleCompressorFile(file) {
    var ext = getFileExtension(file.name);
    var allowed = ['pdf', 'jpg', 'jpeg', 'png', 'txt'];
    
    if (!allowed.includes(ext)) {
        alert('Unsupported file format. Please use PDF, JPG, PNG, or TXT.');
        return;
    }
    
    compressorFile = file;
    compressorFilename.textContent = file.name;
    compressorFilesize.textContent = formatFileSize(file.size);
    
    compressorDropzone.style.display = 'none';
    compressorOptions.style.display = 'block';
    compressorProgress.style.display = 'none';
    compressorResult.style.display = 'none';
    
    compressorHint.textContent = 'Original size: ' + formatFileSizeKB(file.size);
    compressorTarget.value = '';
    compressorWarning.style.display = 'none';
}

setupDropzone(compressorDropzone, compressorInput, handleCompressorFile);

compressorRemove.addEventListener('click', function() {
    compressorFile = null;
    compressorInput.value = '';
    compressorDropzone.style.display = 'block';
    compressorOptions.style.display = 'none';
});

compressorTarget.addEventListener('input', function() {
    if (!compressorFile) return;
    
    var targetKB = parseInt(this.value);
    var originalKB = compressorFile.size / 1024;
    
    if (targetKB && targetKB < originalKB * 0.2) {
        compressorWarning.style.display = 'flex';
    } else {
        compressorWarning.style.display = 'none';
    }
});

compressorProcess.addEventListener('click', async function() {
    if (!compressorFile) return;
    
    var targetKB = parseInt(compressorTarget.value);
    if (!targetKB || targetKB <= 0) {
        alert('Please enter a valid target size in KB.');
        return;
    }
    
    compressorOptions.style.display = 'none';
    compressorProgress.style.display = 'block';
    
    try {
        var result = await compressFile(compressorFile, targetKB);
        
        compressorProgress.style.display = 'none';
        compressorResult.style.display = 'block';
        
        compressorOriginal.textContent = formatFileSize(compressorFile.size);
        compressorCompressed.textContent = formatFileSize(result.size);
        
        var savedPercent = Math.round((1 - result.size / compressorFile.size) * 100);
        compressorSaved.textContent = savedPercent + '%';
        
        compressorOutputBlob = result;
    } catch (error) {
        alert('Compression failed: ' + error.message);
        compressorProgress.style.display = 'none';
        compressorOptions.style.display = 'block';
    }
});

compressorDownload.addEventListener('click', function() {
    if (!compressorOutputBlob || !compressorFile) return;
    
    var ext = getFileExtension(compressorFile.name);
    var baseName = getFileNameWithoutExt(compressorFile.name);
    var newName = baseName + '_compressed.' + ext;
    
    downloadBlob(compressorOutputBlob, newName);
});

compressorReset.addEventListener('click', function() {
    compressorFile = null;
    compressorOutputBlob = null;
    compressorInput.value = '';
    compressorDropzone.style.display = 'block';
    compressorOptions.style.display = 'none';
    compressorProgress.style.display = 'none';
    compressorResult.style.display = 'none';
});

async function compressFile(file, targetKB) {
    var ext = getFileExtension(file.name);
    
    for (var i = 0; i <= 100; i += 5) {
        compressorPercent.textContent = i + '%';
        compressorFill.style.width = i + '%';
        await sleep(50);
    }
    
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
        return await compressImage(file, targetKB);
    } else if (ext === 'txt') {
        return await compressText(file, targetKB);
    } else if (ext === 'pdf') {
        return await compressPDF(file, targetKB);
    }
    
    throw new Error('Unsupported file type for compression');
}

async function compressImage(file, targetKB) {
    return new Promise(function(resolve, reject) {
        var img = new Image();
        var reader = new FileReader();
        
        reader.onload = function(e) {
            img.onload = function() {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                
                var width = img.width;
                var height = img.height;
                
                var currentKB = file.size / 1024;
                var scaleFactor = Math.sqrt(targetKB / currentKB);
                
                if (scaleFactor < 1) {
                    width = Math.floor(width * scaleFactor);
                    height = Math.floor(height * scaleFactor);
                }
                
                width = Math.max(width, 100);
                height = Math.max(height, 100);
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                var quality = 0.9;
                var ext = getFileExtension(file.name);
                var mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
                
                var tryCompress = function() {
                    canvas.toBlob(function(blob) {
                        if (blob.size / 1024 <= targetKB || quality <= 0.1) {
                            resolve(blob);
                        } else {
                            quality -= 0.1;
                            canvas.toBlob(function(newBlob) {
                                resolve(newBlob);
                            }, mimeType, quality);
                        }
                    }, mimeType, quality);
                };
                
                tryCompress();
            };
            img.src = e.target.result;
        };
        
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function compressText(file, targetKB) {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        
        reader.onload = function(e) {
            var text = e.target.result;
            var compressed = pako.deflate(text, { level: 9 });
            var blob = new Blob([compressed], { type: 'application/octet-stream' });
            resolve(blob);
        };
        
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

async function compressPDF(file, targetKB) {
    return new Promise(function(resolve) {
        var blob = new Blob([file], { type: 'application/pdf' });
        resolve(blob);
    });
}

// ================================
// EXPANDER
// ================================

function handleExpanderFile(file) {
    var ext = getFileExtension(file.name);
    var allowed = ['pdf', 'jpg', 'jpeg', 'png', 'txt'];
    
    if (!allowed.includes(ext)) {
        alert('Unsupported file format. Please use PDF, JPG, PNG, or TXT.');
        return;
    }
    
    expanderFile = file;
    expanderFilename.textContent = file.name;
    expanderFilesize.textContent = formatFileSize(file.size);
    
    expanderDropzone.style.display = 'none';
    expanderOptions.style.display = 'block';
    expanderProgress.style.display = 'none';
    expanderResult.style.display = 'none';
    
    expanderHint.textContent = 'Original size: ' + formatFileSizeKB(file.size);
    expanderTarget.value = '';
    expanderWarning.style.display = 'none';
}

setupDropzone(expanderDropzone, expanderInput, handleExpanderFile);

expanderRemove.addEventListener('click', function() {
    expanderFile = null;
    expanderInput.value = '';
    expanderDropzone.style.display = 'block';
    expanderOptions.style.display = 'none';
});

expanderTarget.addEventListener('input', function() {
    if (!expanderFile) return;
    
    var targetKB = parseInt(this.value);
    var originalKB = expanderFile.size / 1024;
    
    if (targetKB && targetKB > originalKB * 10) {
        expanderWarning.style.display = 'flex';
    } else {
        expanderWarning.style.display = 'none';
    }
});

expanderProcess.addEventListener('click', async function() {
    if (!expanderFile) return;
    
    var targetKB = parseInt(expanderTarget.value);
    if (!targetKB || targetKB <= 0) {
        alert('Please enter a valid target size in KB.');
        return;
    }
    
    var originalKB = expanderFile.size / 1024;
    if (targetKB <= originalKB) {
        alert('Target size must be larger than original size (' + formatFileSizeKB(expanderFile.size) + ').');
        return;
    }
    
    expanderOptions.style.display = 'none';
    expanderProgress.style.display = 'block';
    
    try {
        var result = await expandFile(expanderFile, targetKB);
        
        expanderProgress.style.display = 'none';
        expanderResult.style.display = 'block';
        
        expanderOriginalEl.textContent = formatFileSize(expanderFile.size);
        expanderExpanded.textContent = formatFileSize(result.size);
        
        expanderOutputBlob = result;
    } catch (error) {
        alert('Expansion failed: ' + error.message);
        expanderProgress.style.display = 'none';
        expanderOptions.style.display = 'block';
    }
});

expanderDownload.addEventListener('click', function() {
    if (!expanderOutputBlob || !expanderFile) return;
    
    var ext = getFileExtension(expanderFile.name);
    var baseName = getFileNameWithoutExt(expanderFile.name);
    var newName = baseName + '_expanded.' + ext;
    
    downloadBlob(expanderOutputBlob, newName);
});

expanderReset.addEventListener('click', function() {
    expanderFile = null;
    expanderOutputBlob = null;
    expanderInput.value = '';
    expanderDropzone.style.display = 'block';
    expanderOptions.style.display = 'none';
    expanderProgress.style.display = 'none';
    expanderResult.style.display = 'none';
});

async function expandFile(file, targetKB) {
    for (var i = 0; i <= 100; i += 5) {
        expanderPercent.textContent = i + '%';
        expanderFill.style.width = i + '%';
        await sleep(50);
    }
    
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        
        reader.onload = function(e) {
            var originalData = new Uint8Array(e.target.result);
            var originalSize = originalData.length;
            var targetSize = targetKB * 1024;
            var paddingSize = targetSize - originalSize;
            
            if (paddingSize <= 0) {
                resolve(new Blob([originalData], { type: file.type }));
                return;
            }
            
            var padding = new Uint8Array(paddingSize);
            var expanded = new Uint8Array(targetSize);
            expanded.set(originalData, 0);
            expanded.set(padding, originalSize);
            
            var blob = new Blob([expanded], { type: file.type });
            resolve(blob);
        };
        
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// ================================
// CONVERTER
// ================================

// FIX #1: Handle multiple image files for JPG→PDF
function handleConverterMultipleFiles(files) {
    var allImages = files.every(function(f) {
        var ext = getFileExtension(f.name);
        return ['jpg', 'jpeg', 'png'].includes(ext);
    });

    if (!allImages) {
        alert('Please select only image files (JPG or PNG) for multi-image conversion.');
        return;
    }

    converterMultipleFiles = files;
    converterFile = files[0];

    var names = files.map(function(f) { return f.name; }).join(', ');
    var totalSize = files.reduce(function(sum, f) { return sum + f.size; }, 0);

    converterFilename.textContent = files.length + ' images selected';
    converterFilesize.textContent = formatFileSize(totalSize);

    converterDropzone.style.display = 'none';
    converterOptions.style.display = 'block';
    converterProgress.style.display = 'none';
    converterResult.style.display = 'none';

    // For multiple images, force PDF as the only format
    converterFormats.innerHTML = '';
    var btn = document.createElement('button');
    btn.className = 'format-btn active';
    btn.textContent = 'PDF';
    btn.dataset.format = 'pdf';
    converterFormats.appendChild(btn);
    converterSelectedFormat = 'pdf';

    converterWarning.style.display = 'none';
}

function handleConverterFile(file) {
    converterMultipleFiles = null;

    var ext = getFileExtension(file.name);
    var allowed = ['pdf', 'jpg', 'jpeg', 'png'];
    
    if (!allowed.includes(ext)) {
        alert('Unsupported file format. Please use PDF, JPG, or PNG.');
        return;
    }
    
    converterFile = file;
    converterFilename.textContent = file.name;
    converterFilesize.textContent = formatFileSize(file.size);
    
    converterDropzone.style.display = 'none';
    converterOptions.style.display = 'block';
    converterProgress.style.display = 'none';
    converterResult.style.display = 'none';
    
    updateConverterFormats(ext);
    
    if (file.size > 5 * 1024 * 1024) {
        converterWarning.style.display = 'flex';
    } else {
        converterWarning.style.display = 'none';
    }
}

function updateConverterFormats(ext) {
    converterFormats.innerHTML = '';
    converterSelectedFormat = null;
    
    var formats = [];
    
    if (ext === 'pdf') {
        formats = ['JPG', 'PNG'];
    } else if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
        formats = ['PDF'];
        if (ext !== 'jpg' && ext !== 'jpeg') formats.push('JPG');
        if (ext !== 'png') formats.push('PNG');
    }
    
    formats.forEach(function(format, index) {
        var btn = document.createElement('button');
        btn.className = 'format-btn' + (index === 0 ? ' active' : '');
        btn.textContent = format;
        btn.dataset.format = format.toLowerCase();
        
        btn.addEventListener('click', function() {
            converterFormats.querySelectorAll('.format-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            converterSelectedFormat = btn.dataset.format;
        });
        
        converterFormats.appendChild(btn);
        
        if (index === 0) {
            converterSelectedFormat = format.toLowerCase();
        }
    });
}

setupConverterDropzone(converterDropzone, converterInput, handleConverterFile, handleConverterMultipleFiles);

converterRemove.addEventListener('click', function() {
    converterFile = null;
    converterMultipleFiles = null;
    converterInput.value = '';
    converterDropzone.style.display = 'block';
    converterOptions.style.display = 'none';
});

converterProcess.addEventListener('click', async function() {
    if (!converterFile || !converterSelectedFormat) return;
    
    converterOptions.style.display = 'none';
    converterProgress.style.display = 'block';
    
    try {
        var result;

        // FIX #1: If multiple images are selected and format is PDF
        if (converterMultipleFiles && converterMultipleFiles.length > 1 && converterSelectedFormat === 'pdf') {
            result = await convertMultipleImagesToPDF(converterMultipleFiles);
        } else {
            result = await convertFile(converterFile, converterSelectedFormat);
        }
        
        converterProgress.style.display = 'none';
        converterResult.style.display = 'block';
        
        var fromExt = converterMultipleFiles && converterMultipleFiles.length > 1
            ? 'IMAGES'
            : getFileExtension(converterFile.name).toUpperCase();
        converterFrom.textContent = fromExt;
        converterTo.textContent = converterSelectedFormat.toUpperCase();
        
        if (result && result.isMultiPage) {
            converterOutputBlobs = result.blobs;
            converterOutputBlob = null;
            converterPreviewOutput.style.display = 'none';
            converterDownload.textContent = '';
            converterDownload.innerHTML = '<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg> Download ZIP (' + result.blobs.length + ' pages)';
        } else {
            converterOutputBlob = result;
            converterOutputBlobs = null;
            if (converterSelectedFormat === 'jpg' || converterSelectedFormat === 'png') {
                converterPreviewOutput.style.display = 'block';
                converterPreviewImg.src = URL.createObjectURL(result);
            } else {
                converterPreviewOutput.style.display = 'none';
            }
            converterDownload.innerHTML = '<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg> Download Converted File';
        }
    } catch (error) {
        alert('Conversion failed: ' + error.message);
        converterProgress.style.display = 'none';
        converterOptions.style.display = 'block';
    }
});

converterDownload.addEventListener('click', async function() {
    if (!converterFile && !converterMultipleFiles) return;
    
    if (converterOutputBlobs && converterOutputBlobs.length > 0) {
        var zip = new JSZip();
        converterOutputBlobs.forEach(function(blob, index) {
            var pageNum = index + 1;
            var safeFilename = 'file-page-' + pageNum + '.' + converterSelectedFormat;
            zip.file(safeFilename, blob);
        });
        var zipBlob = await zip.generateAsync({ type: 'blob', mimeType: 'application/zip' });
        downloadBlob(zipBlob, 'converted-images.zip');
    } else if (converterOutputBlob) {
        var baseName = converterMultipleFiles && converterMultipleFiles.length > 1
            ? 'combined-images'
            : getFileNameWithoutExt(converterFile.name);
        var newName = baseName + '-converted.' + converterSelectedFormat;
        downloadBlob(converterOutputBlob, newName);
    }
});

converterReset.addEventListener('click', function() {
    converterFile = null;
    converterMultipleFiles = null;
    converterOutputBlob = null;
    converterOutputBlobs = null;
    converterSelectedFormat = null;
    converterInput.value = '';
    converterDropzone.style.display = 'block';
    converterOptions.style.display = 'none';
    converterProgress.style.display = 'none';
    converterResult.style.display = 'none';
    converterDownload.innerHTML = '<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg> Download Converted File';
});

async function convertFile(file, targetFormat) {
    var ext = getFileExtension(file.name);
    
    for (var i = 0; i <= 80; i += 5) {
        converterPercent.textContent = i + '%';
        converterFill.style.width = i + '%';
        await sleep(30);
    }
    
    var result;
    if (ext === 'pdf' && (targetFormat === 'jpg' || targetFormat === 'png')) {
        result = await convertPDFToImages(file, targetFormat);
    } else if ((ext === 'jpg' || ext === 'jpeg' || ext === 'png') && targetFormat === 'pdf') {
        result = await convertImageToPDF(file);
    } else if ((ext === 'jpg' || ext === 'jpeg') && targetFormat === 'png') {
        result = await convertImageFormat(file, 'image/png');
    } else if (ext === 'png' && targetFormat === 'jpg') {
        result = await convertImageFormat(file, 'image/jpeg');
    } else {
        throw new Error('Unsupported conversion');
    }
    
    converterPercent.textContent = '100%';
    converterFill.style.width = '100%';
    await sleep(100);
    
    return result;
}

// FIX #1: Convert MULTIPLE images to a single PDF (one page per image)
async function convertMultipleImagesToPDF(files) {
    var jsPDF = window.jspdf.jsPDF;

    for (var i = 0; i <= 50; i += 5) {
        converterPercent.textContent = i + '%';
        converterFill.style.width = i + '%';
        await sleep(20);
    }

    return new Promise(async function(resolve, reject) {
        try {
            var pdf = null;

            for (var idx = 0; idx < files.length; idx++) {
                var file = files[idx];
                var dataUrl = await readFileAsDataURL(file);

                await new Promise(function(res, rej) {
                    var img = new Image();
                    img.onload = function() {
                        var imgWidth = img.width;
                        var imgHeight = img.height;

                        var pageWidth = 210;
                        var pageHeight = 297;

                        var ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
                        var width = imgWidth * ratio;
                        var height = imgHeight * ratio;

                        var orientation = width > height ? 'l' : 'p';

                        if (!pdf) {
                            pdf = new jsPDF(orientation, 'mm', 'a4');
                        } else {
                            pdf.addPage('a4', orientation);
                        }

                        var x = (pdf.internal.pageSize.getWidth() - width) / 2;
                        var y = (pdf.internal.pageSize.getHeight() - height) / 2;

                        var imgFormat = getFileExtension(file.name).toUpperCase();
                        if (imgFormat === 'JPG') imgFormat = 'JPEG';

                        pdf.addImage(dataUrl, imgFormat, x, y, width, height);
                        res();
                    };
                    img.onerror = rej;
                    img.src = dataUrl;
                });

                var progress = 50 + Math.round(((idx + 1) / files.length) * 48);
                converterPercent.textContent = progress + '%';
                converterFill.style.width = progress + '%';
            }

            converterPercent.textContent = '100%';
            converterFill.style.width = '100%';
            await sleep(100);

            var blob = pdf.output('blob');
            resolve(blob);
        } catch (err) {
            reject(err);
        }
    });
}

function readFileAsDataURL(file) {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function(e) { resolve(e.target.result); };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function convertPDFToImages(file, format) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        
        reader.onload = async function(e) {
            try {
                var typedArray = new Uint8Array(e.target.result);
                var pdf = await pdfjsLib.getDocument(typedArray).promise;
                var numPages = pdf.numPages;
                var mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
                var blobs = [];
                
                for (var pageNum = 1; pageNum <= numPages; pageNum++) {
                    var page = await pdf.getPage(pageNum);
                    
                    var scale = 2.5;
                    var viewport = page.getViewport({ scale: scale });
                    
                    var canvas = document.createElement('canvas');
                    var context = canvas.getContext('2d');
                    
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    
                    await page.render({
                        canvasContext: context,
                        viewport: viewport
                    }).promise;
                    
                    var blob = await new Promise(function(res) {
                        canvas.toBlob(function(b) { res(b); }, mimeType, 1.0);
                    });
                    
                    blobs.push(blob);
                    
                    var progress = Math.round(80 + (pageNum / numPages) * 18);
                    converterPercent.textContent = progress + '%';
                    converterFill.style.width = progress + '%';
                }
                
                if (numPages === 1) {
                    resolve(blobs[0]);
                } else {
                    resolve({ isMultiPage: true, blobs: blobs });
                }
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

async function convertImageToPDF(file) {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        
        reader.onload = function(e) {
            var img = new Image();
            
            img.onload = function() {
                var jsPDF = window.jspdf.jsPDF;
                
                var imgWidth = img.width;
                var imgHeight = img.height;
                
                var pageWidth = 210;
                var pageHeight = 297;
                
                var ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
                var width = imgWidth * ratio;
                var height = imgHeight * ratio;
                
                var orientation = width > height ? 'l' : 'p';
                var pdf = new jsPDF(orientation, 'mm', 'a4');
                
                var x = (pdf.internal.pageSize.getWidth() - width) / 2;
                var y = (pdf.internal.pageSize.getHeight() - height) / 2;
                
                pdf.addImage(e.target.result, 'JPEG', x, y, width, height);
                
                var blob = pdf.output('blob');
                resolve(blob);
            };
            
            img.onerror = reject;
            img.src = e.target.result;
        };
        
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function convertImageFormat(file, targetMime) {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        
        reader.onload = function(e) {
            var img = new Image();
            
            img.onload = function() {
                var canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                
                var ctx = canvas.getContext('2d');
                
                if (targetMime === 'image/jpeg') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob(function(blob) {
                    resolve(blob);
                }, targetMime, 0.95);
            };
            
            img.onerror = reject;
            img.src = e.target.result;
        };
        
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ================================
// INTERSECTION OBSERVER FOR NAV
// ================================

var sections = document.querySelectorAll('section[id]');

var observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
};

var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            
            navLinks.forEach(function(link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(function(section) {
    observer.observe(section);
});

// ================================
// FAQ ACCORDION
// ================================

(function() {
    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function(item) {
        var question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            var isOpen = item.classList.contains('open');
            // Close all
            faqItems.forEach(function(i) { i.classList.remove('open'); });
            // Toggle current
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });
})();

// ================================
// WELCOME POPUP (FIRST VISIT)
// ================================

(function() {
    if (!localStorage.getItem('filebox_visited')) {
        var overlay = document.getElementById('welcome-popup');
        if (overlay) {
            overlay.classList.remove('hidden');

            var closePopup = function() {
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 0.3s ease';
                setTimeout(function() {
                    overlay.classList.add('hidden');
                }, 300);
                localStorage.setItem('filebox_visited', 'true');
            };

            document.getElementById('popup-get-started').addEventListener('click', function() {
                closePopup();
                document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
            });

            document.getElementById('popup-close').addEventListener('click', closePopup);

            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    closePopup();
                }
            });
        }
    }
})();

// ================================
// STAR RATING FEEDBACK
// ================================

(function() {
    var starBtns = document.querySelectorAll('.star-btn');
    var ratingThanks = document.getElementById('rating-thanks');
    var ratingAverage = document.getElementById('rating-average');
    var hasRated = localStorage.getItem('hasRated');

    function calcAverage() {
        var ratings = JSON.parse(localStorage.getItem('ratings')) || [];
        if (ratings.length === 0) {
            ratingAverage.textContent = 'No ratings yet';
            return;
        }
        var sum = ratings.reduce(function(acc, val) { return acc + val; }, 0);
        var avg = (sum / ratings.length).toFixed(1);
        ratingAverage.textContent = avg + ' / 5 (' + ratings.length + (ratings.length === 1 ? ' rating' : ' ratings') + ')';
    }

    function highlightStars(value) {
        starBtns.forEach(function(btn) {
            var btnVal = parseInt(btn.dataset.value);
            btn.classList.toggle('star-active', btnVal <= value);
        });
    }

    function clearHighlight() {
        if (hasRated) return;
        var saved = parseInt(localStorage.getItem('rating')) || 0;
        highlightStars(saved);
    }

    if (hasRated) {
        var savedRating = parseInt(localStorage.getItem('rating')) || 0;
        highlightStars(savedRating);
        ratingThanks.style.display = 'block';
        starBtns.forEach(function(btn) { btn.disabled = true; });
    }

    calcAverage();

    starBtns.forEach(function(btn) {
        btn.addEventListener('mouseenter', function() {
            if (hasRated) return;
            highlightStars(parseInt(this.dataset.value));
        });

        btn.addEventListener('mouseleave', function() {
            clearHighlight();
        });

        btn.addEventListener('click', function() {
            if (hasRated) return;
            var selected = parseInt(this.dataset.value);

            var ratings = JSON.parse(localStorage.getItem('ratings')) || [];
            ratings.push(selected);
            localStorage.setItem('ratings', JSON.stringify(ratings));
            localStorage.setItem('rating', selected);
            localStorage.setItem('hasRated', '1');
            hasRated = '1';

            highlightStars(selected);
            ratingThanks.style.display = 'block';
            starBtns.forEach(function(b) { b.disabled = true; });
            calcAverage();
        });
    });
})();

console.log('FileBox by BlackFish - Initialized');

// Firebase import
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getFirestore, addDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
// Config
const firebaseConfig = {
  apiKey: "MY_API_KEY",
  authDomain: "filebox-rating.firebaseapp.com",
  projectId: "filebox-rating",
  storageBucket: "filebox-rating.firebasestorage.app",
  messagingSenderId: "558068310894",
  appId: "1:558068310894:web:42d0648a233a3ebc4b577f",
  measurementId: "G-RB95HSXCZL"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const stars = document.querySelectorAll(".star-btn");
const thanksMsg = document.getElementById("rating-thanks");

stars.forEach(star => {
  star.addEventListener("click", async () => {
    const rating = Number(star.getAttribute("data-value"));

    // Firebase me save
    await addDoc(collection(db, "ratings"), {
      value: rating,
      createdAt: new Date()
    });

    // UI feedback
    thanksMsg.style.display = "block";
    setTimeout(() => {
      thanksMsg.style.display = "none";
    }, 2000);

    // Average update
    loadAverageRating();
  });
});

const avgText = document.getElementById("rating-average");

async function loadAverageRating() {
  const querySnapshot = await getDocs(collection(db, "ratings"));

  let total = 0;
  let count = 0;

  querySnapshot.forEach(doc => {
    total += doc.data().value;
    count++;
  });

  if (count === 0) {
    avgText.textContent = "No ratings yet";
  } else {
    const avg = (total / count).toFixed(1);
    avgText.textContent = `${avg} / 5 (${count} reviews)`;
  }
}

// Page load pe call karo
loadAverageRating();
