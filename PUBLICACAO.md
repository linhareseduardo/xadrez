# 📱 Guia de Publicação na Google Play Store

## Pré-requisitos

### 1. Conta de Desenvolvedor Google Play
- Acesse: https://play.google.com/console
- Taxa única de **$25 USD**
- Documentos necessários: CPF, comprovante de endereço, cartão de crédito

### 2. Conta Expo
- Crie em: https://expo.dev/signup
- **Gratuito** para builds básicas

---

## 🚀 Método 1: EAS Build (Recomendado)

### Passo 1: Fazer login no Expo

```bash
eas login
```

Digite seu email e senha do Expo.

### Passo 2: Configurar o projeto

```bash
eas build:configure
```

Isso criará o arquivo `eas.json` automaticamente.

### Passo 3: Criar o build para Android

```bash
eas build --platform android
```

**Escolha uma das opções:**
- `apk` - Para testar localmente (mais rápido)
- `aab` - Para publicar na Play Store (obrigatório)

O build será feito na nuvem do Expo (demora 10-20 minutos).

### Passo 4: Baixar o arquivo APK/AAB

Após o build terminar, você receberá um link para baixar o arquivo `.aab`.

---

## 📝 Passo 5: Preparar informações da Play Store

Você precisará preparar:

### Ícone do App
- Tamanho: **512x512 pixels**
- Formato: PNG sem transparência
- Local: Criar em `assets/icon.png`

### Screenshots
- Mínimo 2 capturas de tela
- Tamanho recomendado: 1080x1920 pixels
- Tire screenshots do jogo rodando

### Descrição do App

**Título:** Xadrez

**Descrição Curta (80 caracteres):**
```
Jogo de xadrez completo com todas as regras e interface intuitiva
```

**Descrição Completa:**
```
♟️ Xadrez - Jogo Completo

Desafie sua mente com este elegante jogo de xadrez!

🎮 CARACTERÍSTICAS:
• Tabuleiro completo 8x8
• Todas as peças tradicionais (peão, torre, cavalo, bispo, rainha, rei)
• Regras oficiais de movimentação
• Sistema de turnos automático
• Indicação visual de movimentos possíveis
• Captura de peças
• Interface limpa e intuitiva
• Modo dois jogadores no mesmo dispositivo

♔ COMO JOGAR:
1. Toque em uma peça para selecioná-la
2. Veja os movimentos válidos destacados em amarelo
3. Toque no quadrado de destino para mover
4. Os turnos alternam automaticamente
5. Capture o rei adversário para vencer!

Perfeito para jogadores iniciantes e experientes. Jogue contra amigos e família no mesmo dispositivo!
```

### Categoria
- **Jogos > Tabuleiro**

### Classificação de Conteúdo
- **Livre** (L) - Jogo de xadrez não tem violência ou conteúdo impróprio

---

## 📦 Passo 6: Publicar na Play Store

1. Acesse: https://play.google.com/console
2. Clique em **"Criar app"**
3. Preencha as informações básicas
4. Vá em **"Produção"** > **"Criar nova versão"**
5. Faça upload do arquivo `.aab`
6. Preencha todas as informações obrigatórias:
   - Descrição do app
   - Screenshots
   - Ícone
   - Política de privacidade (se coletar dados)
   - Classificação de conteúdo
7. Clique em **"Revisar versão"**
8. Clique em **"Iniciar lançamento"**

### ⏱️ Tempo de Análise
- Primeira publicação: **1-3 dias**
- Atualizações: **algumas horas a 1 dia**

---

## 🔧 Método 2: Build Local (Avançado)

Se preferir não usar EAS Build:

### 1. Instalar Android Studio
- Download: https://developer.android.com/studio
- Configure Android SDK

### 2. Build local
```bash
npx expo prebuild
npx expo run:android --variant release
```

### 3. Gerar keystore (primeira vez)
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore xadrez.keystore -alias xadrez -keyalg RSA -keysize 2048 -validity 10000
```

---

## 💡 Dicas Importantes

### Versão do App
- Sempre incremente a versão em `app.json` antes de um novo build:
```json
{
  "expo": {
    "version": "1.0.0",  // Incrementar para 1.0.1, 1.1.0, etc.
    "android": {
      "versionCode": 1    // Incrementar para 2, 3, 4, etc.
    }
  }
}
```

### Política de Privacidade
Se seu app não coleta dados, você pode usar um template simples ou criar uma página dizendo:
```
Este aplicativo não coleta, armazena ou compartilha nenhum dado pessoal dos usuários.
```

### Testadores Internos (Opcional)
Antes de publicar para todos:
1. Vá em **"Testes internos"** na Play Console
2. Adicione emails de testadores
3. Publique uma versão de teste primeiro

---

## 📊 Checklist Final

Antes de publicar, verifique:

- [ ] Testou o jogo completamente no celular
- [ ] Ícone 512x512 criado
- [ ] Pelo menos 2 screenshots tirados
- [ ] Descrição escrita
- [ ] Categoria selecionada
- [ ] Classificação de conteúdo respondida
- [ ] Build `.aab` gerado com sucesso
- [ ] Conta Google Play criada e paga ($25)
- [ ] Política de privacidade (se necessário)

---

## 🆘 Problemas Comuns

### "App Bundle não assinado"
- Use EAS Build, ele assina automaticamente
- Ou configure keystore manualmente

### "Ícone muito pequeno"
- Precisa ser exatamente 512x512 pixels
- Use ferramentas online para redimensionar

### "Falta política de privacidade"
- Crie uma página simples no GitHub Pages
- Ou use geradores gratuitos online

---

## 🎉 Próximos Passos Após Publicação

1. **Compartilhe** o link da Play Store
2. **Peça avaliações** de amigos/família
3. **Atualize** regularmente com melhorias
4. **Monitore** downloads e feedback

---

## 📞 Suporte

- Documentação EAS: https://docs.expo.dev/build/introduction/
- Play Console Help: https://support.google.com/googleplay/android-developer
- Expo Discord: https://chat.expo.dev/

**Boa sorte com a publicação! 🚀♟️**
