/**
 * Mystic AI App Logic for Shopify
 * Handles Camera, Image Processing, and Gemini AI API
 */

/**
 * Mystic Auth Logic for Shopify
 * Handles Google Login via Firebase
 */
const MysticAuth = {
  googleLogin: async function() {
    // 提示：在实际生产中，你需要在这里初始化 Firebase
    // 这里演示了标准的 Google 登录流程
    console.log("Initiating Google Login...");
    
    // 1. 弹出 Google 登录窗口
    // 2. 获取用户 Token
    // 3. 将 Token 发送到你的后端或直接在 Shopify 中创建 Session
    
    // 由于 Shopify 主题无法直接操作数据库，通常的做法是：
    // 使用 Firebase 验证后，通过 AJAX 调用 Shopify 的 /account/login 接口
    // 或者使用第三方插件（如 Social Login）提供的 API
    
    alert("Google 登录功能已在前端就绪。请在 Firebase 控制台配置您的项目 ID，并在此处完成 SDK 初始化即可正式使用。");
  }
};

const MysticApp = {
  state: {
    type: 'face',
    stream: null,
    isAnalyzing: false,
    language: 'zh-CN',
    userData: {
      name: '',
      gender: 'male',
      dob: ''
    }
  },

  selectMode: function(type) {
    this.state.type = type;
    this.switchView('selection');
  },

  updateLanguage: function(lang) {
    this.state.language = lang;
  },

  startCamera: async function() {
    this.state.userData.name = document.getElementById('user-name').value;
    this.state.userData.gender = document.getElementById('user-gender').value;
    this.state.userData.dob = document.getElementById('user-dob').value;

    this.switchView('camera');
    
    try {
      this.state.stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: this.state.type === 'face' ? 'user' : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      const video = document.getElementById('mystic-video');
      video.srcObject = this.state.stream;
    } catch (err) {
      console.error("Camera Error:", err);
      alert("无法访问摄像头。请确保已授予权限并使用 HTTPS 环境。");
      this.reset();
    }
  },

  capture: function() {
    const video = document.getElementById('mystic-video');
    const canvas = document.getElementById('mystic-canvas');
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
    this.analyze(base64Image);
  },

  // 简单的五行计算逻辑 (移植自原工程)
  calculateWuXing: function(dob) {
    if (!dob) return null;
    const year = new Date(dob).getFullYear();
    const elements = ['Metal', 'Water', 'Wood', 'Fire', 'Earth'];
    // 这是一个简化的占位逻辑，实际可根据需要增加更复杂的八字算法
    const index = year % 5;
    return {
      primary: elements[index],
      scores: {
        Metal: 20, Water: 20, Wood: 20, Fire: 20, Earth: 20
      }
    };
  },

  analyze: async function(base64Data) {
    if (!window.MysticConfig.apiKey) {
      alert("请先在 Shopify 后台 Section 设置中配置 Gemini API Key。");
      this.reset();
      return;
    }

    this.switchView('analyzing');

    const wuXing = this.calculateWuXing(this.state.userData.dob);
    const langMap = {
      'zh-CN': '简体中文',
      'en-US': 'English',
      'ja-JP': '日本語',
      'ko-KR': '한국어',
      'zh-TW': '繁體中文'
    };

    let prompt = `你是一位精通面相和手相的东方命理大师。
    当前用户：${this.state.userData.name || '缘主'}，性别：${this.state.userData.gender === 'male' ? '男' : '女'}。
    分析类型：${this.state.type === 'face' ? '面相' : '手相'}。
    ${this.state.userData.dob ? `出生日期：${this.state.userData.dob}。` : ''}
    ${wuXing ? `初步五行分析：主属性为 ${wuXing.primary}。` : ''}
    
    请根据图片进行深度分析，给出性格、运势和建议。
    重要要求：请务必使用 ${langMap[this.state.language]} 进行回复。
    使用Markdown格式，多用相关的表情符号。`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${window.MysticConfig.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: "image/jpeg", data: base64Data } }
            ]
          }]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const resultText = data.candidates[0].content.parts[0].text;
      this.renderResult(resultText);
    } catch (err) {
      console.error("AI Error:", err);
      alert("分析失败: " + err.message);
      this.reset();
    }
  },

  renderResult: function(text) {
    const resultDiv = document.getElementById('analysis-result');
    // 增强的 Markdown 渲染
    let html = text
      .replace(/### (.*)/g, '<h3 style="color:var(--accent-color);margin-top:20px;">$1</h3>')
      .replace(/## (.*)/g, '<h2 style="color:var(--accent-color);margin-top:25px;border-bottom:1px solid var(--accent-color);padding-bottom:5px;">$1</h2>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/\* (.*)/g, '<li style="margin-left:20px;">$1</li>')
      .replace(/\n/g, '<br>');
    
    resultDiv.innerHTML = html;
    this.switchView('result');
  },

  switchView: function(viewId) {
    document.querySelectorAll('.mystic-view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById('view-' + viewId);
    if (target) target.classList.add('active');
    window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
  },

  reset: function() {
    if (this.state.stream) {
      this.state.stream.getTracks().forEach(track => track.stop());
    }
    this.switchView('start');
  }
};
