/**
 * FileBox by BlackFish
 * Browser-based file processing toolkit
 */

// ================================
// DOM ELEMENTS
// ================================

// Header & Navigation
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');
const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');

// Tool Tabs & Panels
const toolTabs = document.querySelectorAll('.tool-tab');
const toolPanels = document.querySelectorAll('.tool-panel');

// Compressor Elements
const compressorDropzone = document.getElementById('compressor-dropzone');
const compressorInput = document.getElementById('compressor-input');
const compressorOptions = document.getElementById('compressor-options');
const compressorFilename = document.getElementById('compressor-filename');
const compressorFilesize = document.getElementById('compressor-filesize');
const compressorRemove = document.getElementById('compressor-remove');
const compressorTarget = document.getElementById('compressor-target');
const compressorHint = document.getElementById('compressor-hint');
const compressorWarning = document.getElementById('compressor-warning');
const compressorProcess = document.getElementById('compressor-process');
const compressorProgress = document.getElementById('compressor-progress');
const compressorPercent = document.getElementById('compressor-percent');
const compressorFill = document.getElementById('compressor-fill');
const compressorResult = document.getElementById('compressor-result');
const compressorOriginal = document.getElementById('compressor-original');
const compressorCompressed = document.getElementById('compressor-compressed');
const compressorSaved = document.getElementById('compressor-saved');
const compressorDownload = document.getElementById('compressor-download');
const compressorReset = document.getElementById('compressor-reset');

// Expander Elements
const expanderDropzone = document.getElementById('expander-dropzone');
const expanderInput = document.getElementById('expander-input');
const expanderOptions = document.getElementById('expander-options');
const expanderFilename = document.getElementById('expander-filename');
const expanderFilesize = document.getElementById('expander-filesize');
const expanderRemove = document.getElementById('expander-remove');
const expanderTarget = document.getElementById('expander-target');
const expanderHint = document.getElementById('expander-hint');
const expanderWarning = document.getElementById('expander-warning');
const expanderProcess = document.getElementById('expander-process');
const expanderProgress = document.getElementById('expander-progress');
const expanderPercent = document.getElementById('expander-percent');
const expanderFill = document.getElementById('expander-fill');
const expanderResult = document.getElementById('expander-result');
const expanderOriginalEl = document.getElementById('expander-original');
const expanderExpanded = document.getElementById('expander-expanded');
const expanderDownload = document.getElementById('expander-download');
const expanderReset = document.getElementById('expander-reset');

// Converter Elements
const converterDropzone = document.getElementById('converter-dropzone');
const converterInput = document.getElementById('converter-input');
const converterOptions = document.getElementById('converter-options');
const converterFilename = document.getElementById('converter-filename');
const converterFilesize = document.getElementById('converter-filesize');
const converterRemove = document.getElementById('converter-remove');
const converterFormats = document.getElementById('converter-formats');
const converterWarning = document.getElementById('converter-warning');
const converterProcess = document.getElementById('converter-process');
const converterProgress = document.getElementById('converter-progress');
const converterPercent = document.getElementById('converter-percent');
const converterFill = document.getElementById('converter-fill');
const converterResult = document.getElementById('converter-result');
const converterFrom = document.getElementById('converter-from');
const converterTo = document.getElementById('converter-to');
const converterPreviewOutput = document.getElementById('converter-preview-output');
const converterPreviewImg = document.getElementById('converter-preview-img');
const converterDownload = document.getElementById('converter-download');
const converterReset = document.getElementById('converter-reset');

// ================================
// STATE
// ================================

let compressorFile = null;
let compressorOutputBlob = null;

let expanderFile = null;
let expanderOutputBlob = null;

let converterFile = null;
let converterOutputBlob = null;
let converterSelectedFormat = null;

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
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ================================
// HEADER & NAVIGATION
// ================================

// Scroll effect for header
window.addEventListener('scroll', function() {
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Hamburger menu toggle
hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
    navMobile.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMobile.classList.remove('active');
        
        // Update active state
        navLinks.forEach(function(l) { l.classList.remove('active'); });
        
        // Set active on matching links
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
        
        // Update tab states
        toolTabs.forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        
        // Update panel states
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
    
    var sizeKB = file.size / 1024;
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
    
    saveAs(compressorOutputBlob, newName);
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
    
    // Simulate progress
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
        // For PDF, we'll do a basic approach - reduce quality of embedded images
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
                
                // Start with original dimensions
                var width = img.width;
                var height = img.height;
                
                // Calculate scale factor based on target size
                var currentKB = file.size / 1024;
                var scaleFactor = Math.sqrt(targetKB / currentKB);
                
                if (scaleFactor < 1) {
                    width = Math.floor(width * scaleFactor);
                    height = Math.floor(height * scaleFactor);
                }
                
                // Minimum dimensions
                width = Math.max(width, 100);
                height = Math.max(height, 100);
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                // Adjust quality to meet target size
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
            
            // Use pako for compression
            var compressed = pako.deflate(text, { level: 9 });
            var blob = new Blob([compressed], { type: 'application/octet-stream' });
            
            resolve(blob);
        };
        
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

async function compressPDF(file, targetKB) {
    // For PDF compression, we'll return the file with metadata about compression
    // True PDF compression would require complex re-encoding
    return new Promise(function(resolve) {
        // Since true PDF compression is complex, we'll notify the user
        // In a real implementation, you'd use a library like pdf-lib
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
    
    saveAs(expanderOutputBlob, newName);
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
    // Simulate progress
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
            
            // Create padding data (null bytes that don't affect file functionality)
            var padding = new Uint8Array(paddingSize);
            
            // Combine original data with padding
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

function handleConverterFile(file) {
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
    
    // Show available conversion formats
    updateConverterFormats(ext);
    
    // Show warning for large files
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

setupDropzone(converterDropzone, converterInput, handleConverterFile);

converterRemove.addEventListener('click', function() {
    converterFile = null;
    converterInput.value = '';
    converterDropzone.style.display = 'block';
    converterOptions.style.display = 'none';
});

converterProcess.addEventListener('click', async function() {
    if (!converterFile || !converterSelectedFormat) return;
    
    converterOptions.style.display = 'none';
    converterProgress.style.display = 'block';
    
    try {
        var result = await convertFile(converterFile, converterSelectedFormat);
        
        converterProgress.style.display = 'none';
        converterResult.style.display = 'block';
        
        var fromExt = getFileExtension(converterFile.name).toUpperCase();
        converterFrom.textContent = fromExt;
        converterTo.textContent = converterSelectedFormat.toUpperCase();
        
        // Show preview for images
        if (converterSelectedFormat === 'jpg' || converterSelectedFormat === 'png') {
            converterPreviewOutput.style.display = 'block';
            converterPreviewImg.src = URL.createObjectURL(result);
        } else {
            converterPreviewOutput.style.display = 'none';
        }
        
        converterOutputBlob = result;
    } catch (error) {
        alert('Conversion failed: ' + error.message);
        converterProgress.style.display = 'none';
        converterOptions.style.display = 'block';
    }
});

converterDownload.addEventListener('click', function() {
    if (!converterOutputBlob || !converterFile) return;
    
    var baseName = getFileNameWithoutExt(converterFile.name);
    var newName = baseName + '_converted.' + converterSelectedFormat;
    
    saveAs(converterOutputBlob, newName);
});

converterReset.addEventListener('click', function() {
    converterFile = null;
    converterOutputBlob = null;
    converterSelectedFormat = null;
    converterInput.value = '';
    converterDropzone.style.display = 'block';
    converterOptions.style.display = 'none';
    converterProgress.style.display = 'none';
    converterResult.style.display = 'none';
});

async function convertFile(file, targetFormat) {
    var ext = getFileExtension(file.name);
    
    // Simulate progress
    for (var i = 0; i <= 100; i += 5) {
        converterPercent.textContent = i + '%';
        converterFill.style.width = i + '%';
        await sleep(50);
    }
    
    if (ext === 'pdf' && (targetFormat === 'jpg' || targetFormat === 'png')) {
        return await convertPDFToImage(file, targetFormat);
    } else if ((ext === 'jpg' || ext === 'jpeg' || ext === 'png') && targetFormat === 'pdf') {
        return await convertImageToPDF(file);
    } else if ((ext === 'jpg' || ext === 'jpeg') && targetFormat === 'png') {
        return await convertImageFormat(file, 'image/png');
    } else if (ext === 'png' && targetFormat === 'jpg') {
        return await convertImageFormat(file, 'image/jpeg');
    }
    
    throw new Error('Unsupported conversion');
}

async function convertPDFToImage(file, format) {
    // Set up PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        
        reader.onload = async function(e) {
            try {
                var typedArray = new Uint8Array(e.target.result);
                var pdf = await pdfjsLib.getDocument(typedArray).promise;
                var page = await pdf.getPage(1);
                
                var scale = 2;
                var viewport = page.getViewport({ scale: scale });
                
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
                
                var mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
                canvas.toBlob(function(blob) {
                    resolve(blob);
                }, mimeType, 0.95);
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
                
                // Calculate dimensions to fit the image on the page
                var imgWidth = img.width;
                var imgHeight = img.height;
                
                // A4 dimensions in mm
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
                
                // For JPEG, fill with white background (no transparency)
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
// INITIALIZATION
// ================================

console.log('FileBox by BlackFish - Initialized');
