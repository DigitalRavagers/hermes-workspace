#!/usr/bin/env node
/**
 * NotebookLM Direct API Client
 * Uses HTTP requests to interact with NotebookLM without browser automation
 */

const NOTEBOOKLM_BASE = 'https://notebooklm.google.com/api/v1';
const COOKIE = process.env.NOTEBOOKLM_COOKIE || process.env.NOTEBOOKLM_AUTH;

if (!COOKIE) {
  console.error('❌ Error: NOTEBOOKLM_COOKIE environment variable not set');
  console.error('\nTo get your cookie:');
  console.error('1. Open https://notebooklm.google.com in Chrome (logged in)');
  console.error('2. DevTools → Application → Cookies');
  console.error('3. Copy value of __Secure-1PSID or SSID');
  console.error('4. export NOTEBOOKLM_COOKIE="paste_here"');
  process.exit(1);
}

const args = process.argv.slice(2);
const command = args[0];

async function apiCall(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${NOTEBOOKLM_BASE}${endpoint}`;
  
  const headers = {
    'Cookie': `__Secure-1PSID=${COOKIE}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text.substring(0, 200)}`);
    }
    
    return await response.json().catch(() => ({ success: true }));
  } catch (err) {
    console.error(`❌ API Error: ${err.message}`);
    throw err;
  }
}

// Commands
const commands = {
  async list() {
    console.log('📓 Fetching notebooks...\n');
    try {
      // Try the main endpoint
      const data = await apiCall('/notebooks');
      
      if (!data.notebooks || data.notebooks.length === 0) {
        console.log('No notebooks found or authentication required.');
        return;
      }
      
      console.log(`Found ${data.notebooks.length} notebook(s):\n`);
      data.notebooks.forEach((nb, i) => {
        console.log(`${i + 1}. ${nb.title || 'Untitled'}`);
        console.log(`   ID: ${nb.id}`);
        console.log(`   Sources: ${nb.sourceCount || 0}`);
        console.log(`   Created: ${new Date(nb.createdAt).toLocaleDateString()}`);
        console.log('');
      });
      
      return data.notebooks;
    } catch (err) {
      console.error('❌ Failed to list notebooks');
      console.error('Check your cookie is valid and not expired');
    }
  },

  async create(title) {
    if (!title) {
      console.error('Usage: create "Notebook Title"');
      return;
    }
    
    console.log(`📓 Creating notebook: "${title}"...`);
    try {
      const data = await apiCall('/notebooks', {
        method: 'POST',
        body: JSON.stringify({ title })
      });
      
      console.log('✅ Notebook created!');
      console.log(`ID: ${data.id}`);
      console.log(`URL: https://notebooklm.google.com/notebook/${data.id}`);
      return data;
    } catch (err) {
      console.error('❌ Failed to create notebook');
    }
  },

  async addSource(notebookId, ...rest) {
    if (!notebookId) {
      console.error('Usage: add-source <notebook-id> --title "Title" --content "Text"');
      return;
    }
    
    const titleIndex = rest.indexOf('--title');
    const contentIndex = rest.indexOf('--content');
    
    const title = titleIndex > -1 ? rest[titleIndex + 1] : 'Untitled Source';
    const content = contentIndex > -1 ? rest[contentIndex + 1] : rest.join(' ');
    
    if (!content) {
      console.error('❌ Error: No content provided');
      console.error('Use: --content "Your text here" or pipe content');
      return;
    }
    
    console.log(`📄 Adding source to notebook ${notebookId}...`);
    try {
      const data = await apiCall(`/notebooks/${notebookId}/sources`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          content,
          type: 'text'
        })
      });
      
      console.log('✅ Source added!');
      console.log(`ID: ${data.sourceId || data.id}`);
      return data;
    } catch (err) {
      console.error('❌ Failed to add source');
    }
  },

  async addDrive(notebookId, ...rest) {
    if (!notebookId) {
      console.error('Usage: add-drive <notebook-id> --file-id <drive-file-id> --title "Title"');
      return;
    }
    
    const fileIdIndex = rest.indexOf('--file-id');
    const titleIndex = rest.indexOf('--title');
    
    const fileId = fileIdIndex > -1 ? rest[fileIdIndex + 1] : null;
    const title = titleIndex > -1 ? rest[titleIndex + 1] : 'Drive Document';
    
    if (!fileId) {
      console.error('❌ Error: No Google Drive file ID provided');
      console.error('Use: --file-id "1ABC123..."');
      return;
    }
    
    console.log(`📄 Adding Google Drive file to notebook ${notebookId}...`);
    try {
      const data = await apiCall(`/notebooks/${notebookId}/sources`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          driveFileId: fileId,
          type: 'drive'
        })
      });
      
      console.log('✅ Drive file added!');
      return data;
    } catch (err) {
      console.error('❌ Failed to add Drive file');
    }
  },

  async chat(notebookId, ...messageParts) {
    if (!notebookId || messageParts.length === 0) {
      console.error('Usage: chat <notebook-id> "Your question here"');
      return;
    }
    
    const message = messageParts.join(' ');
    console.log(`💬 Asking: "${message.substring(0, 60)}..."\n`);
    
    try {
      const data = await apiCall(`/notebooks/${notebookId}/chat`, {
        method: 'POST',
        body: JSON.stringify({ message })
      });
      
      console.log('🤖 Response:\n');
      console.log(data.response || data.message || JSON.stringify(data, null, 2));
      return data;
    } catch (err) {
      console.error('❌ Failed to get response');
    }
  },

  async generate(notebookId, ...rest) {
    if (!notebookId) {
      console.error('Usage: generate <notebook-id> --type <briefing|faq|study-guide> --prompt "..."');
      return;
    }
    
    const typeIndex = rest.indexOf('--type');
    const promptIndex = rest.indexOf('--prompt');
    
    const type = typeIndex > -1 ? rest[typeIndex + 1] : 'briefing';
    const prompt = promptIndex > -1 ? rest[promptIndex + 1] : 'Create a summary';
    
    console.log(`🎯 Generating ${type}...`);
    try {
      const data = await apiCall(`/notebooks/${notebookId}/generate`, {
        method: 'POST',
        body: JSON.stringify({ type, prompt })
      });
      
      console.log('✅ Generated!');
      console.log(`ID: ${data.artifactId || data.id}`);
      return data;
    } catch (err) {
      console.error('❌ Failed to generate');
    }
  },

  help() {
    console.log(`
📓 NotebookLM Direct API Client

Usage: notebooklm-api.mjs <command> [options]

Commands:
  list                          List all notebooks
  create "Title"                Create new notebook
  add-source <id> --title "T" --content "Text"
                                Add text source to notebook
  add-drive <id> --file-id "1ABC..." --title "T"
                                Add Google Drive file to notebook
  chat <id> "Question"          Chat with notebook
  generate <id> --type <t> --prompt "p"
                                Generate artifact (briefing, faq, etc.)
  help                          Show this help

Environment:
  NOTEBOOKLM_COOKIE             Your Google auth cookie (required)

Examples:
  export NOTEBOOKLM_COOKIE="your_cookie_here"
  
  node notebooklm-api.mjs list
  node notebooklm-api.mjs create "Research Project"
  node notebooklm-api.mjs add-source abc123 --title "Notes" --content "Text here"
  node notebooklm-api.mjs chat abc123 "What are the key points?"
`);
  }
};

// Run command
if (!command || command === 'help') {
  commands.help();
} else if (commands[command]) {
  commands[command](...args.slice(1));
} else {
  console.error(`❌ Unknown command: ${command}`);
  console.error('Run without arguments for help');
  process.exit(1);
}
