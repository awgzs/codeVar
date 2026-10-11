'use strict';

const alfy = require('alfy');
const fs = require('fs');
const path = require('path');
const os = require('os');
const SHA256 = require('crypto-js').SHA256
const Hex = require('crypto-js/enc-hex')

function truncate(q){
  var len = q.length;
  if(len<=20) return q;
  return q.substring(0, 10) + len + q.substring(len-10, len);
}

/**
 * 读取有道翻译密钥，无需修改源码。
 * 优先级：
 *   1. Alfred 工作流环境变量 CODEVAR_APP_KEY / CODEVAR_SECRET_KEY
 *      （在 Alfred → Workflows → CodeVar 的「环境变量 / Variables」面板中配置）
 *   2. 工作流根目录下的 codevar.config.json（格式见 codevar.config.example.json）
 *   3. 用户主目录下的 ~/.codevar.config.json
 */
function loadCredentials() {
    var fromEnv = function (name) {
        return (process.env[name] || '').trim();
    };
    var fromFile = function (file) {
        try {
            if (fs.existsSync(file)) {
                var data = JSON.parse(fs.readFileSync(file, 'utf8'));
                var appKey = (data.appKey || data.APP_KEY || '').toString().trim();
                var secretKey = (data.secretKey || data.SECRET_KEY || data.key || '').toString().trim();
                if (appKey && secretKey) {
                    return { appKey: appKey, key: secretKey, source: file };
                }
            }
        } catch (e) { /* 配置文件格式错误时忽略，继续向下查找 */ }
        return null;
    };

    var appKey = fromEnv('CODEVAR_APP_KEY');
    var key = fromEnv('CODEVAR_SECRET_KEY');
    if (appKey && key) {
        return { appKey: appKey, key: key, source: '工作流环境变量' };
    }

    var fromWorkflowDir = fromFile(path.join(__dirname, '..', 'codevar.config.json'));
    if (fromWorkflowDir) return fromWorkflowDir;

    var fromHomeDir = fromFile(path.join(os.homedir(), '.codevar.config.json'));
    if (fromHomeDir) return fromHomeDir;

    return null;
}

function showMissingKeyError() {
    alfy.output([{
        title: 'CodeVar：未配置有道翻译密钥',
        subtitle: '请在 Alfred 工作流「环境变量」中填写 CODEVAR_APP_KEY 和 CODEVAR_SECRET_KEY，或在工作流根目录放置 codevar.config.json（详见 README）',
        arg: 'error',
        valid: false,
    }]);
}

module.exports = {
    youDaoApi: 'http://openapi.youdao.com/api',
    getParams: function () {
        var cred = loadCredentials();
        if (!cred) {
            showMissingKeyError();
            return null;
        }
        var appKey = cred.appKey;
        var key = cred.key;
        var salt = (new Date).getTime();
        var curtime = Math.round(new Date().getTime()/1000);
        var query = alfy.input || '苹果';
        // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
        var from = 'zh-CHS';
        var to = 'en';
        var str1 = appKey + truncate(query) + salt + curtime + key;
        var sign = SHA256(str1).toString(Hex)
        return {
          query: {
            q: query,
            appKey: appKey,
            salt: salt,
            from: from,
            to: to,
            sign: sign,
            signType: "v3",
            curtime: curtime,
          }
        }
    },
    filter: {
        prep: [
            'and', 'or', 'the', 'a', 'at', 'of'
        ],
        prefix: [],
        suffix: [
            'ing', 'ed', 'ly'
        ],
        verb: [
            'was'
        ]
    }
};
