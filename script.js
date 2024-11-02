// DOM Elements
const generateBtn = document.querySelector('.generate-btn');
const memeTitle = document.querySelector('.meme-title');
const memeImg = document.querySelector('.meme-img-container img');
const memeAuthor = document.querySelector('.meme-author');

// Custom meme elements
const imageFileInput = document.getElementById('imageFileInput');
const topTextInput = document.getElementById('topTextInput');
const bottomTextInput = document.getElementById('bottomTextInput');
const canvas = document.getElementById('meme');

// Initialize canvas context
const ctx = canvas.getContext('2d');

// Default canvas size
canvas.width = 500;
canvas.height = 500;

// Variables for custom meme
let image;

// Random Meme Generator
generateBtn.addEventListener('click', generateMeme);

async function generateMeme() {
    try {
        const response = await fetch('https://meme-api.com/gimme');
        const data = await response.json();
        
        memeTitle.textContent = data.title;
        memeImg.setAttribute('src', data.url);
        memeAuthor.textContent = `Meme by ${data.author}`;
    } catch (error) {
        console.error('Error fetching meme:', error);
        memeTitle.textContent = 'Error loading meme';
    }
}

// Custom Meme Creator
imageFileInput.addEventListener('change', (e) => {
    const imageDataUrl = URL.createObjectURL(e.target.files[0]);

    image = new Image();
    image.src = imageDataUrl;

    image.addEventListener('load', () => {
        updateMemeCanvas(canvas, ctx, image, topTextInput.value, bottomTextInput.value);
    }, { once: true });
});

topTextInput.addEventListener('input', () => {
    updateMemeCanvas(canvas, ctx, image, topTextInput.value, bottomTextInput.value);
});

bottomTextInput.addEventListener('input', () => {
    updateMemeCanvas(canvas, ctx, image, topTextInput.value, bottomTextInput.value);
});

function updateMemeCanvas(canvas, ctx, image, topText, bottomText) {
    if (!image) return;

    // Calculate new canvas dimensions while maintaining aspect ratio
    const aspectRatio = image.width / image.height;
    const maxWidth = 500;
    const maxHeight = 500;
    
    let newWidth = maxWidth;
    let newHeight = maxWidth / aspectRatio;

    if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = maxHeight * aspectRatio;
    }

    canvas.width = newWidth;
    canvas.height = newHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Text style
    const fontSize = Math.floor(canvas.width / 15);
    ctx.font = `bold ${fontSize}px Impact`;
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = Math.floor(fontSize / 8);
    ctx.fillStyle = 'white';

    // Draw top text
    if (topText) {
        ctx.textBaseline = 'top';
        ctx.strokeText(topText, canvas.width / 2, 10);
        ctx.fillText(topText, canvas.width / 2, 10);
    }

    // Draw bottom text
    if (bottomText) {
        ctx.textBaseline = 'bottom';
        ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 10);
        ctx.fillText(bottomText, canvas.width / 2, canvas.height - 10);
    }
}

// Generate initial meme on page load
generateMeme();