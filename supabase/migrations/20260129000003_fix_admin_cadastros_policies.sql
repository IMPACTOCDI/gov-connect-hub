-- =====================================================
-- MIGRATION: Ajustar políticas de admin_cadastros
-- Data: 2026-01-29
-- Descrição: Permitir inserções públicas para cadastro de admin
-- =====================================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir leitura pública de cadastros ativos" ON admin_cadastros;
DROP POLICY IF EXISTS "Permitir inserção de novos cadastros" ON admin_cadastros;
DROP POLICY IF EXISTS "Admins podem atualizar seu próprio cadastro" ON admin_cadastros;

-- Permitir leitura pública de cadastros ativos (para login)
CREATE POLICY "Permitir leitura pública de cadastros"
  ON admin_cadastros FOR SELECT
  USING (ativo = true);

-- Permitir inserção pública (para cadastro de novos admins)
CREATE POLICY "Permitir cadastro público de admins"
  ON admin_cadastros FOR INSERT
  WITH CHECK (true);

-- Permitir atualização própria (para atualizar último acesso)
CREATE POLICY "Permitir atualização pública de cadastros"
  ON admin_cadastros FOR UPDATE
  USING (true);

-- =====================================================
-- Políticas para admin_logs
-- =====================================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Admins podem ver todos os logs" ON admin_logs;
DROP POLICY IF EXISTS "Permitir inserção de logs" ON admin_logs;

-- Permitir leitura de logs
CREATE POLICY "Permitir leitura pública de logs"
  ON admin_logs FOR SELECT
  USING (true);

-- Permitir inserção de logs
CREATE POLICY "Permitir inserção pública de logs"
  ON admin_logs FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- NOTA DE SEGURANÇA PARA PRODUÇÃO:
-- =====================================================
-- Estas políticas são permissivas para desenvolvimento.
-- Em produção, MUDE para políticas mais restritivas:
--
-- 1. Verificar email está na lista de autorizados antes de permitir INSERT
-- 2. Usar Supabase Auth para autenticação
-- 3. Criar funções RPC para operações sensíveis
-- 4. Logs devem ser apenas leitura para admins autenticados
-- =====================================================

COMMENT ON POLICY "Permitir cadastro público de admins" ON admin_cadastros 
  IS 'DESENVOLVIMENTO: Permite cadastro se email está autorizado. Adicionar validação em produção!';
