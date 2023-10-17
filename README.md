# 保有しているSuperSIMを検索

このプログラムを使うことで、自分の持っているSuperSIMを検索することができます。  
マスターアカウントだけでなく、保有しているサブアカウントもすべて検索対象です。

## 前提（動作確認済み）条件

- Node.js バージョン 16.13以上
- npm 8.1.0以上

## セットアップ

```zsh
git clone https://github.com/mobilebiz/find-sims.git
cd find-sims
yarn install # or npm install
```

## 環境変数の設定

```zsh
cp .env.example .env
```

`.env`を以下の内容で更新してください。

Key|Value
:--|:--
TWILIO_ACCOUNT_SID|対象とするマスターアカウントのAccountSid
TWILIO_AUTH_TOKEN|同じくAuthToken

## 実行

```zsh
node index.js
```

## 実行例

```sh
*** TAKAHASHI(active) ***
sim: HSb1506be651dee8302222b88bcb75de08(inactive)
sim: HS5d64d9ff63ed92db02254664ade20d93(inactive)
sim: HSbe2f7230058c05a1e4dbfbb31efe86bd(new)
*** account2(active) ***```

## 制限事項

サブアカウントが`suspended`になっている場合、一度ステータスを変更してから処理を行いますが、TwilioによってサスペンドされているサブアカウントについてはAPI経由での変更ができないため、スキップするようになっています。
