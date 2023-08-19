const paperSizes = {
    'A4': { wordsPerPage: 250 },
    'A5': { wordsPerPage: 150 },
    'Letter': { wordsPerPage: 300 },
    'Legal': { wordsPerPage: 320 },
    'A3': { wordsPerPage: 550 },
    'A6': { wordsPerPage: 75 },
};

function countCharacters(text) {
    return text.length;
}

function countWords(text) {
    const words = text.trim().split(/\s+/);
    return words.length;
}

function countSentences(text) {
    const sentences = text.split(/[.!?]/).filter(sentence => sentence.trim() !== "");
    return sentences.length;
}

function countParagraphs(text) {
    const paragraphs = text.trim().split(/\s*\n\s*\n/g);
    return paragraphs.length;
}

function estimatePages(words, pageSize) {
    const { wordsPerPage } = paperSizes[pageSize];
    const totalPages = Math.ceil(words / wordsPerPage);
    return totalPages;
}

function calculateFleschKincaidGradeLevel(text) {
    // Count the number of words, sentences, and syllables in the text
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]/).length - 1;
    let syllables = 0;

    words.forEach(word => {
        syllables += countSyllables(word);
    });

    // Avoid division by zero
    if (words.length === 0 || sentences === 0) {
        return 0; // Return a default value or handle it as needed
    }

    // Calculate the Flesch-Kincaid Grade Level
    const wordsPerSentence = words.length / sentences;
    const syllablesPerWord = syllables / words.length;
    const gradeLevel = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;

    return gradeLevel;
}

// Function to count syllables in a word
function countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;

    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');

    const syllables = word.match(/[aeiouy]{1,2}/g);

    return syllables ? syllables.length : 0;
}

function categorizeReadability(gradeLevel) {
    if (gradeLevel >= 12) {
        return "Difficult";
    } else if (gradeLevel >= 10) {
        return "Moderate Difficult";
    } else if (gradeLevel >= 8) {
        return "Easy";
    } else if (gradeLevel >= 6) {
        return "Quite Easy";
    } else {
        return "Too Easy";
    }
}

function calculateReadingTime(words) {
    const wordsPerMinute = 200;

    const minutes = words / wordsPerMinute;
    return Math.ceil(minutes);
}

function calculateSpeakingTime(words) {
    const wordsPerMinute = 125;

    const minutes = words / wordsPerMinute;
    return Math.ceil(minutes);
}

function checkTextLimit(text, minLimit, maxLimit) {
    const textLength = text.length;

    if (textLength >= minLimit && textLength <= maxLimit) {
        return "<span class='has-text-success'>Pass</span>";
    } else {
        return "<span class='has-text-danger'>Fail</span>";
    }
}

function ShowResult(inputText) {
    var Characters = document.getElementById('characters');
    var Words = document.getElementById('words');
    var Sentences = document.getElementById('sentences');
    var Paragraphs = document.getElementById('paragraphs');
    var Pages = document.getElementById('pages');
    var Reaingl = document.getElementById('reading-level');
    var Readingt = document.getElementById('reading-time');
    var Speakingt = document.getElementById('speaking-time');
    const results = [
        [document.getElementById('pinterest-description'), 0, 500],
        [document.getElementById('snapchat-caption'), 0, 250],
        [document.getElementById('youtube-description'), 0, 5000],
        [document.getElementById('youtube-title'), 0, 70],
        [document.getElementById('facebook-message'), 0, 20000],
        [document.getElementById('facebook-username'), 0, 50],
        [document.getElementById('facebook-pdescription'), 0, 255],
        [document.getElementById('facebook-comment'), 0, 8000],
        [document.getElementById('facebook-apost'), 0, 63206],
        [document.getElementById('facebook-post'), 0, 477],
        [document.getElementById('twitter-username'), 0, 20],
        [document.getElementById('insta-caption'), 0, 2200],
        [document.getElementById('twitter-post'), 0, 280],
        [document.getElementById('meta-description'), 0, 160],
        [document.getElementById('meta-title'), 0, 55]
    ];
    if (inputText != '') {
        const charCount = countCharacters(inputText);
        const wordCount = countWords(inputText);
        const sentenceCount = countSentences(inputText);
        const paragraphCount = countParagraphs(inputText);
        var pageSize = document.getElementById('pagetype').value;
        const pagesCount = estimatePages(wordCount, pageSize);
        const SpeakingTime = calculateSpeakingTime(wordCount);
        const ReadingTime = calculateReadingTime(wordCount, sentenceCount);
        const Gradelevel = calculateFleschKincaidGradeLevel(inputText)
        const ReadingLevel = categorizeReadability(Gradelevel);
        Characters.innerHTML = charCount;
        Words.innerHTML = wordCount;
        Sentences.innerHTML = sentenceCount;
        Paragraphs.innerHTML = paragraphCount;
        Pages.innerHTML = pagesCount;
        Reaingl.innerHTML = ReadingLevel;
        Readingt.innerHTML = `${ReadingTime} Minute`;
        Speakingt.innerHTML = `${SpeakingTime} Minute`;
        for (let i = 0; i < results.length; i++) {
            results[i][0].innerHTML = checkTextLimit(inputText, results[i][1], results[i][2]);
        }
        const result = () => {
            const words = inputText.trim().split(/\s+/).length; // Count words
            if (words >= 300) {
                return "<span class='has-text-success'>Pass</span>";
            } else {
                return "<span class='has-text-danger'>Fail</span>";
            }
        };

        document.getElementById('google-post').innerHTML = result();

    }
    else {
        // Set innerHTML values to 0
        Characters.innerHTML = 0;
        Words.innerHTML = 0;
        Sentences.innerHTML = 0;
        Paragraphs.innerHTML = 0;
        Pages.innerHTML = 0;
        Reaingl.innerHTML = '0 Minute';
        Readingt.innerHTML = '0 Minute';
        Speakingt.innerHTML = '-';
        for (let i = 0; i < results.length; i++) {
            results[i][0].innerHTML = '-';
        }
        document.getElementById('google-post').innerHTML = '-';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    var inputText = document.getElementById("inputText");
    inputText.addEventListener("input", () => {
        var text = inputText.value;
        ShowResult(text);
    });

    var pageSizeSelect = document.getElementById("pagetype");
    pageSizeSelect.addEventListener("change", () => {
        var text = inputText.value;
        ShowResult(text);
    });

    document.getElementById('clear').addEventListener('click', () => {
        if (confirm("Do you really want to clear ?")) {
            inputText.value = '';
            var text = inputText.value;
            ShowResult(text);
        }
    })
});