-----------------------------------------
-- スキーマ作成
-----------------------------------------
-- イベント用スキーマ
CREATE SCHEMA IF NOT EXISTS events;

-----------------------------------------
-- ユーザー作成
-----------------------------------------
-- アプリ用
CREATE USER app WITH LOGIN ENCRYPTED PASSWORD 'password';
-- レプリケーション用
CREATE USER repl WITH REPLICATION LOGIN ENCRYPTED PASSWORD 'password';
-- レプリケーション/CDC用
CREATE USER system WITH REPLICATION LOGIN ENCRYPTED PASSWORD 'password';


-----------------------------------------
-- ロール作成(アプリ)
-----------------------------------------
CREATE ROLE app_role;

GRANT CONNECT ON DATABASE auth TO app_role;
GRANT USAGE ON SCHEMA public, events, masters TO app_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public, events, masters TO app_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public, events, masters GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_role;

GRANT USAGE ON ALL SEQUENCES IN SCHEMA public, events, masters TO app_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public, events, masters GRANT USAGE ON SEQUENCES TO app_role;


-----------------------------------------
-- ロール作成(マイグレーション & CDC)
-----------------------------------------
CREATE ROLE system_role;

GRANT CONNECT, CREATE ON DATABASE auth TO system_role;
GRANT USAGE, CREATE ON SCHEMA public, events, masters TO system_role;
GRANT SELECT ON ALL TABLES IN SCHEMA events TO system_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA events GRANT SELECT ON TABLES TO system_role;


-----------------------------------------
-- ユーザーにロールを付与
-----------------------------------------
GRANT app_role TO app;
GRANT system_role TO system;
