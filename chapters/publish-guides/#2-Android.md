# Publicando um aplicativo Android

## Screenshots

1. Abra seu projeto no Android Studio
2. Abra o logcat, em seguida abra a opção de captura de tela ("Screen Capture")
   ![](/images/screnshots_android.png)

## Ícones

`Termo chave`: Adaptive Icon

Utilize o template do Figma em [Introdução](./%231-Introduction.md)

1. Abra seu projeto no Android Studio
2. No menu lateral, seleciona a opção Project
3. Clique com o botão direito em `app` > `New` > `Image Asset`
   ("Screen Capture")
   ![](/images/icons_android.png)

## Alterar nome de exibição do aplicativo

1. Abra o arquivo /app/src/main/res/values/settings.xml
2. Edite a tag `<string name="app_name">{{Nome do aplicativo}}</string>`

## Splash Screen

Utilize a biblioteca [`Bootsplash`](https://github.com/zoontek/react-native-bootsplash) ou [siga este guia](https://cesarhilario.notion.site/Splash-Screen-no-Android-5ca285372e634c46b50038bc6cc263d7)

## Gerando o arquivo de distribuição

> Siga os passos de https://reactnative.dev/docs/signed-apk-android

#### Gerando o certificado assinado

1. Abra a pasta `android/app`
2. Execute `keytool -genkeypair -v -storetype PKCS12 -keystore production-android.keystore -alias production-android -keyalg RSA -keysize 2048 -validity 10000`
3. Insira a senha e guarde-a em um local seguro

#### Definindo as variáveis de ambiente

> Caso for subir o projeto em um repositório público, `NÃO` faça como na etapa abaixo.

- Insira em `gradle.properties` as seguintes configurações

```
MYAPP_UPLOAD_STORE_FILE=production-android.keystore
MYAPP_UPLOAD_KEY_ALIAS=production-android
MYAPP_UPLOAD_STORE_PASSWORD={{senha aqui}}
MYAPP_UPLOAD_KEY_PASSWORD={{senha aqui}}
```

ou

- Insira as variáveis localmente em `~/.gradle/gradle.properties`

```
MYAPP_UPLOAD_STORE_FILE=production-android.keystore
MYAPP_UPLOAD_KEY_ALIAS=production-android
MYAPP_UPLOAD_STORE_PASSWORD={{senha aqui}}
MYAPP_UPLOAD_KEY_PASSWORD={{senha aqui}}
```

#### Adicionando certificado de assinatura no Gradle

- No arquivo `build.gradle` a nível de app, insira em `signingConfigs` as configurações para release referenciando suas variáveis de ambiente.

```gradle
...

android {
   ...
   signingConfigs {
      release {
         if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
      }
   }
   buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}

```

#### Gerando o AAB (Android app bundle)

1. Habilite no `build.gradle` a nível de app as opções `enableSeparateBuildPerCPUArchitecture` e `enableProguardInReleaseBuilds`.
   >

```gradle
// Só habilite esta opção caso você deseje obter arquivos separados para cada arquitetura
def enableSeparateBuildPerCPUArchitecture = true
def enableProguardInReleaseBuilds = true
```

2. (Opcional) Ainda no arquivo `build.gradle` habilite o `hermes`

```gradle
project.ext.react = [
   enableHermes: true
]
```

3. Execute o comando

```sh
./gradlew bundleRelease
```

Após o término, localize-o em `/android/app/builds/outputs/bundle/release`

### Configurando Google Play Store

1. Acesse a Google Play Console (https://play.google.com/console/u/1/developers)
2. No canto superior direito, cliquei em "Criar app"
3. Preencha o formulário com as especificações do seu app
4. Na aba "Crescimento", localizada no menu lateral à esquerda, preencha os formulários presentes em "Presença na loja"

### Distribuindo o app para testers

- Na aba "Versões" na seção "Teste", escolha o tipo de teste que será realizado. `Teste aberto` | `Teste fechado` | `Teste interno`.

### Distribuindo em Produção

- Na seção "Versões" em "Produção", clique em "Adicionar países/regiões"
- Após isso faça upload do arquivo .aab ou escolha um da biblioteca.
