document.addEventListener('DOMContentLoaded', async () => {
    const response = await axios.get('http://127.0.0.1:3000/telugu-text');
    const data = response.data;
    
    if (data && data.Telugu_Words) {
        showTextDetails(data);
    } else {
        document.getElementById('teluguText').innerText = 'No Telugu text found';
    }
});

function handleNextClick() {
    const romanisedInputs = document.getElementById('romanisedInputs').value;
    const phoneticGuide = document.getElementById('phoneticGuide').value;
    const lastId = document.getElementById('teluguText').dataset.lastId;

    updateCurrentText(romanisedInputs, phoneticGuide, lastId)
        .then(() => fetchNextText())
        .catch(console.error);
}

async function updateCurrentText(romanisedInputs, phoneticGuide, lastId) {
    return axios.post('http://127.0.0.1:3000/update-telugu-text', {
        _id: lastId,
        romanisedInputs,
        phoneticGuide
    });
}

async function fetchNextText() {
    const lastId = document.getElementById('teluguText').dataset.lastId;

    const response = await axios.get(`http://127.0.0.1:3000/next-telugu-text?lastId=${lastId}`);
    const data = response.data;

    if (data && data.Telugu_Words) {
        showTextDetails(data);
    } else {
        document.getElementById('teluguText').innerText = 'No more Telugu text found';
    }
}

function showTextDetails(data) {
    document.getElementById('teluguText').innerText = data.Telugu_Words;
    document.getElementById('teluguText').dataset.lastId = data._id;
    document.getElementById('romanisedInputs').value = data.romanisedInputs || '';
    document.getElementById('phoneticGuide').value = data.phoneticGuide || '';
}

document.getElementById('nextBtn').addEventListener('click', handleNextClick);
document.getElementById('prevBtn').addEventListener('click', async () => {
    const lastId = document.getElementById('teluguText').dataset.lastId;

    const response = await axios.get(`http://127.0.0.1:3000/previous-telugu-text?lastId=${lastId}`);
    const data = response.data;

    if (data && data.Telugu_Words) {
        showTextDetails(data);
    } else {
        document.getElementById('teluguText').innerText = 'No previous Telugu text found';
    }
});