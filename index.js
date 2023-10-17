require('dotenv').config();

// TwilioのアカウントSIDとトークンを環境変数から取得する
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// ログを色付きで表示する
const log = (message, color = '') => {
  if (color === 'red') {
    console.info('\x1b[31m%s\x1b[0m', message);
  } else if (color === 'green') {
    console.info('\x1b[32m%s\x1b[0m', message);
  } else if (color === 'yellow') {
    console.info('\x1b[33m%s\x1b[0m', message);
  } else if (color === 'blue') {
    console.info('\x1b[34m%s\x1b[0m', message);
  } else if (color === 'magenta') {
    console.info('\x1b[35m%s\x1b[0m', message);
  } else if (color === 'cyan') {
    console.info('\x1b[36m%s\x1b[0m', message);
  } else {
    console.info(message);
  }
}

// サブアカウントをクロールする
client.api.v2010.accounts.list()
  .then(async (accounts) => {
    for (let account of accounts) {
      log(`*** ${account.friendlyName}(${account.status}) ***`, account.status === 'active' ? '' : 'cyan');
      try {
        if (account.status === 'active') await execSubAccount(account);
        if (account.status === 'suspended') {
          // サスペンデッドの場合はサブアカウントを一時的にアクティブにする
          await client.api.v2010.accounts(account.sid).update({ status: 'active' });
          await execSubAccount(account);
          // サスペンドに戻す
          await client.api.v2010.accounts(account.sid).update({ status: 'suspended' });
        };        
      } catch (error) {
        log(`${error}`, 'red')
        // 処理は継続させる
        continue;
      }
    }
  });
  
  // サブアカウントごとに処理を実行する
  const execSubAccount = (account) => {
    return new Promise(async (resolve, reject) => {
      try {
        const subClient = require('twilio')(account.sid, account.authToken);
        const sims = await subClient.supersim.v1.sims.list();
        // const incomingPhoneNumbers = await subClient.incomingPhoneNumbers.list();
        for (let i of sims) {
          log(`sim: ${i.sid}(${i.status})`, 'yellow');
        };
        resolve();      
      } catch (error) {
        reject(error);
      }
  });
};
