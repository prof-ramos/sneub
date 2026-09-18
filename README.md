# SNEUB

Questionário standalone, sem cadastro e sem banco de dados, que transforma alternativas fechadas em sinais `good`, `warn` e `bad`. As regras locais continuam responsáveis por segurança, padrões, heat, textos e roasts. A IA não escreve o resultado.

## Arquitetura

- `src/sneub-core.js` contém as regras puras de estado, segurança, privacidade do payload, validação e scoring.
- `sneub.js` contém o catálogo editorial, navegação e apresentação no navegador.
- `seu-namoro-e-uma-bosta.html` contém o CSS, o markup e cópias inline geradas do core e da aplicação.
- `api/comment.js` gera comentários opcionais para alternativas fechadas. O payload não aceita respostas livres, caderno, síntese ou a resposta de três anos.
- `api/analyze.js` envia somente respostas ativas de “Outra resposta…” ao Jev, depois de consentimento explícito. Ele normaliza a resposta do provedor para o contrato interno do SNEUB.
- `server/http.js`, `server/analysis-contract.js` e `server/jev.js` isolam infraestrutura HTTP, allowlist/normalização e transporte TypeSafe dos handlers Vercel.
- `vercel.json` publica o HTML standalone na rota `/`; as funções continuam disponíveis em `/api/comment` e `/api/analyze`.
- `localStorage` (`sneub-v3`) guarda respostas fechadas em `a`, respostas customizadas em `c` e os campos editoriais existentes. Estados antigos sem `c` continuam válidos.

O fluxo sem respostas customizadas não chama o Jev. No fluxo customizado, a pessoa pode continuar sem enviar; nesse caso as respostas livres ficam salvas localmente, mas não entram no score. Uma falha, timeout ou resposta inválida do Jev também cai no resultado local.

## Respostas livres e consentimento

“Outra resposta…” aparece por padrão em todas as perguntas. A pergunta `seguranca` define `allowCustom: false`, pois medo, ameaça, controle, coerção e violência permanecem governados somente pelas regras locais.

O texto customizado:

- tem limite de 500 caracteres;
- é salvo enquanto a pessoa digita;
- não é enviado para `/api/comment`;
- só é enviado em lote a `/api/analyze` após a ação “Analisar minhas respostas escritas”;
- nunca é enviado se `safetyLocked()` estiver ativo.

O backend valida IDs, capítulos e temas contra um catálogo fechado. Não registra corpos, respostas livres, payloads completos nem respostas brutas do provedor.

## Comentário generativo

Configure no ambiente server-side:

```dotenv
SNEUB_COMMENT_API_KEY=
SNEUB_COMMENT_BASE_URL=https://code.verboo.ai/router/v1
SNEUB_COMMENT_MODEL=deepseek-v4-flash
```

Sem essa configuração, o comentário local de cada alternativa continua funcionando.

## Jev / TypeSafe

Configure no ambiente server-side:

```dotenv
SNEUB_JEV_API_KEY=
SNEUB_JEV_BASE_URL=https://api.typesafe.ai
SNEUB_JEV_MODEL=jev-latest
SNEUB_JEV_MIN_CONFIDENCE=
```

A chave nunca é exposta ao navegador. O endpoint faz uma única chamada `POST /v1/systemone` com todas as respostas customizadas, usando uma `Choice` independente por pergunta. Cada escolha é limitada a `good`, `warn`, `bad` ou `unclear`.

`SNEUB_JEV_MIN_CONFIDENCE` fica vazio por padrão. Isso é intencional: até o limiar ser calibrado, o backend converte classificações não ambíguas em `unclear`, impedindo influência no score. Para ativar a influência, rode a avaliação com [`tests/jev-fixtures.json`](tests/jev-fixtures.json), escolha o limiar com base nos erros observados e configure um número entre `0` e `1`. Fixar uma versão específica do modelo é recomendável depois da calibração.

## Contrato interno

O navegador recebe apenas:

```json
{
  "analysis": {
    "paz": {
      "state": "warn",
      "confidence": 0.91,
      "probabilities": {
        "good": 0.06,
        "warn": 0.91,
        "bad": 0.02,
        "unclear": 0.01
      }
    }
  }
}
```

O merge é determinístico: uma classificação válida acrescenta uma observação a cada tema conhecido da pergunta, e o cálculo existente continua sendo `heat = (bad * 2 + warn) / n`. `unclear` não altera o score.

## Sincronização do HTML standalone

Depois de alterar `src/sneub-core.js` ou `sneub.js`, execute:

```sh
node scripts/sync-inline.js
```

Para apenas verificar divergência:

```sh
node scripts/sync-inline.js --check
```

Não edite manualmente o JavaScript dentro do HTML.

## Testes

```sh
npm run check
```

O projeto continua sem dependências. `npm run check` usa somente Node e Git para validar sintaxe, executar todos os testes, conferir a sincronização standalone e rejeitar whitespace inválido no diff.

Para executar localmente com as mesmas rotas `/api/comment` e `/api/analyze` usadas no navegador:

```sh
npm run dev
```

Também valide no navegador: navegação e recarga com resposta customizada, troca entre alternativa fechada e customizada, bloqueio de texto vazio, consentimento/recusa, uma única chamada para várias respostas, fallback do Jev, compartilhamento, wipe e todos os caminhos de segurança com `180`/`188`.

Ao abrir o HTML diretamente por `file://`, endpoints server-side podem estar indisponíveis. A interface continua funcional e usa os fallbacks locais; para testar as APIs, execute o projeto em um ambiente que publique `/api/comment` e `/api/analyze`.
