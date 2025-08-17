const { execSync } = require('child_process');
const fs = require('fs');

const { lesson, date } = JSON.parse(fs.readFileSync('temp-lesson-data.json', 'utf8'));

// Configure git
execSync('git config user.name "System Design Bot"');
execSync('git config user.email "action@github.com"');

// Add files directly to main branch
execSync('git add lessons/ docs/');
execSync(`git commit -m "🧠 Day ${lesson.day}: ${lesson.title}

📚 Today's Topic: ${lesson.topic}
🎯 Key Focus: ${lesson.key_concepts.join(', ')}
🌟 Real-world: ${lesson.real_world_example}

Generated on ${date}"`);

execSync('git push origin main');

console.log(`✅ Lesson committed directly to main branch!`);