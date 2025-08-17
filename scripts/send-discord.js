const https = require('https');
const fs = require('fs');

const { lesson, date } = JSON.parse(fs.readFileSync('temp-lesson-data.json', 'utf8'));

const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
if (!webhookUrl) {
  console.log('Discord webhook URL not found');
  process.exit(0);
}

const embed = {
  title: `🧠 Daily System Design: ${lesson.title}`,
  description: lesson.summary,
  color: 0x0099ff,
  fields: [
    {
      name: "🔑 Key Concepts",
      value: lesson.key_concepts.map(concept => `• ${concept}`).join('\n'),
      inline: false
    },
    {
      name: "🌟 Real-world Example",
      value: lesson.real_world_example,
      inline: false
    },
    {
      name: "💭 Think About This",
      value: lesson.discussion_questions[0],
      inline: false
    }
  ],
  footer: {
    text: `Day ${lesson.day} of 30 • Generated ${date}`
  },
  timestamp: new Date().toISOString()
};

const payload = {
  content: "Good morning! ☀️ Time for your daily system design deep-dive:",
  embeds: [embed]
};

const url = new URL(webhookUrl);
const options = {
  hostname: url.hostname,
  port: url.port || 443,
  path: url.pathname + url.search,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  console.log(`Discord webhook response: ${res.statusCode}`);
});

req.on('error', (error) => {
  console.error('Error sending Discord webhook:', error);
});

req.write(JSON.stringify(payload));
req.end();