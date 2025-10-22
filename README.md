# ♟ Jogo de Xadrez - iOS & Android

Um jogo de xadrez completo e funcional desenvolvido com React Native + Expo, compatível com iOS e Android.

## 🎮 Características

- ✅ Tabuleiro completo 8x8 com todas as peças
- ✅ Regras de movimento para todas as peças (peão, torre, cavalo, bispo, rainha, rei)
- ✅ Sistema de turnos (brancas vs pretas)
- ✅ Indicação visual de movimentos possíveis
- ✅ Captura de peças
- ✅ Detecção de vitória (captura do rei)
- ✅ Funciona em iOS e Android
- ✅ Interface responsiva e intuitiva

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

Para testar no dispositivo:
- Aplicativo **Expo Go** no seu celular ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

## 🚀 Como executar

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o projeto

```bash
npm start
```

ou

```bash
npx expo start
```

### 3. Executar no dispositivo

Após executar o comando acima, você verá um QR code no terminal.

**No celular:**
- **iOS**: Abra a câmera e escaneie o QR code
- **Android**: Abra o app Expo Go e escaneie o QR code

**Ou use os atalhos do terminal:**
- Pressione `a` para abrir no emulador Android
- Pressione `i` para abrir no simulador iOS (apenas macOS)
- Pressione `w` para abrir no navegador

## 🎯 Como jogar

1. O jogo começa com as peças brancas
2. Toque em uma peça para selecioná-la
3. Os quadrados amarelos mostram os movimentos válidos
4. Toque em um quadrado válido para mover a peça
5. Os turnos alternam automaticamente entre brancas e pretas
6. Capture o rei adversário para vencer!

## 📁 Estrutura do projeto

```
xadrez/
├── App.js                      # Componente principal
├── src/
│   ├── components/
│   │   ├── ChessGame.js       # Gerenciador do jogo
│   │   ├── ChessBoard.js      # Renderização do tabuleiro
│   │   ├── ChessSquare.js     # Casa do tabuleiro
│   │   └── ChessPiece.js      # Peça de xadrez
│   └── engine/
│       └── ChessEngine.js     # Lógica e regras do jogo
├── package.json
└── app.json
```

## 🛠️ Tecnologias utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **JavaScript** - Linguagem de programação

## 🎨 Personalizações futuras

Você pode expandir o jogo adicionando:

- ♔ Xeque e xeque-mate
- 🏰 Roque (castling)
- 👑 Promoção de peão
- ↩️ Desfazer movimento
- 💾 Salvar partidas
- 🌐 Modo multiplayer online
- ⏱️ Relógio de xadrez
- 📊 Histórico de movimentos em notação algébrica

## 📱 Build para produção

### Android (APK)

```bash
npx expo build:android
```

### iOS (IPA)

```bash
npx expo build:ios
```

Para mais informações sobre build, consulte a [documentação do Expo](https://docs.expo.dev/build/setup/).

## 📄 Licença

Este projeto é livre para uso pessoal e educacional.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ usando React Native

---

**Divirta-se jogando xadrez! ♟️**
