import axios from 'axios';
const axios_instance = axios.create({});
axios_instance.interceptors.request.use((config) => {
    config.url = 'http://127.0.0.1:3000' + config.url;
    config.headers['token'] = localStorage.getItem('token');
    return config;
}, (error) => {
    return Promise.reject(error);
});
axios_instance.interceptors.response.use((response) => {
    return response.data;
}, (error) => {
    if (error.code === 'ERR_NETWORK') {
        showNotification('失败:网络连接', 'error');
        console.error('失败:网络连接', error);
        return Promise.reject(error);
    }
    return error;
});
export const axios_api = axios_instance;
window.axios_api = axios_api;
function showNotification(message, type = 'info', duration = 3000) {
    if (!document.getElementById('showNotification')) {
        const style = document.createElement('style');
        style.id = 'showNotification';
        style.textContent = `
          /* 消息提示样式 */
          .notification {
              position: fixed;
              top: 20px;
              right: 20px;
              background-color: #333;
              color: white;
              padding: 12px 20px;
              border-radius: 4px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              z-index: 1000;
              opacity: 0;
              transform: translateY(-20px);
              transition: opacity 0.3s ease, transform 0.3s ease;
          }

          .notification.show {
              opacity: 1;
              transform: translateY(0);
          }

          .notification.success {
              background-color: #4CAF50;
          }

          .notification.error {
              background-color: #f44336;
          }

          .notification.info {
              background-color: #2196F3;
          }
      `;
        document.head.appendChild(style);
    }
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode)
                document.body.removeChild(notification);
        }, 3000);
    }, duration);
}
//# sourceMappingURL=axios_api.js.map