const fs = require('fs');
const path = require('path');

const curriculum = JSON.parse(fs.readFileSync('content/curriculum.json', 'utf8'));
const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
const lessonIndex = (dayOfYear - 1) % curriculum.lessons.length;
const lesson = curriculum.lessons[lessonIndex];

const date = new Date().toISOString().split('T')[0];
const lessonContent = `# Day ${lesson.day}: ${lesson.title}

## Overview
${lesson.summary}

## Key Concepts
${lesson.key_concepts.map(concept => `- **${concept}**`).join('\n')}

## System Diagram
\`\`\`mermaid
${lesson.mermaid_diagram}
\`\`\`

## Real-World Example
${lesson.real_world_example}

## Discussion Questions
${lesson.discussion_questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

## Additional Resources
- [System Design Interview Guide](https://github.com/donnemartin/system-design-primer)
- [High Scalability](http://highscalability.com/)

---
*Generated on ${date} | [Take Today's Quiz](../docs/quiz-${date}.html)*
`;

// Write lesson file
const lessonsDir = 'lessons';
if (!fs.existsSync(lessonsDir)) {
  fs.mkdirSync(lessonsDir);
}

fs.writeFileSync(path.join(lessonsDir, `${date}-${lesson.topic.toLowerCase().replace(/\s+/g, '-')}.md`), lessonContent);

// Generate quiz HTML
const quizHTML = `<!DOCTYPE html>
<html>
<head>
    <title>Quiz: ${lesson.title}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .question { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .option { margin: 5px 0; cursor: pointer; }
        .correct { background-color: #d4edda; }
        .incorrect { background-color: #f8d7da; }
    </style>
</head>
<body>
    <h1>Quiz: ${lesson.title}</h1>
    <div id="quiz-container">
        ${lesson.quiz.map((q, i) => `
            <div class="question">
                <h3>${q.question}</h3>
                ${q.options.map((option, j) => `
                    <div class="option" onclick="selectAnswer(${i}, ${j}, ${q.correct})">
                        ${String.fromCharCode(65 + j)}. ${option}
                    </div>
                `).join('')}
            </div>
        `).join('')}
    </div>
    
    <script>
        function selectAnswer(questionIndex, answerIndex, correctIndex) {
            const question = document.querySelectorAll('.question')[questionIndex];
            const options = question.querySelectorAll('.option');
            
            options.forEach(option => option.classList.remove('correct', 'incorrect'));
            
            if (answerIndex === correctIndex) {
                options[answerIndex].classList.add('correct');
            } else {
                options[answerIndex].classList.add('incorrect');
                options[correctIndex].classList.add('correct');
            }
        }
    </script>
</body>
</html>`;

const docsDir = 'docs';
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir);
}

fs.writeFileSync(path.join(docsDir, `quiz-${date}.html`), quizHTML);

// Store lesson data for other scripts
fs.writeFileSync('temp-lesson-data.json', JSON.stringify({ lesson, date, lessonIndex }));