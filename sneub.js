const CHAPTERS = {
  1: "Capítulo 1. Você gosta dessa pessoa mesmo?",
  2: "Capítulo 2. Amor ou estágio não remunerado?",
  3: "Capítulo 3. Seu sistema nervoso pediu demissão?",
  4: "Capítulo 4. Você ainda existe fora desse namoro?",
  5: "Capítulo 5. Agora sem gracinha."
};

const Q = [
  { ch: 1, id: "paz",
    q: "Esta relação te traz mais paz do que dúvidas?",
    opts: [
      { t: "Sim.", tone: "g", themes: { paz: "good" },
        joke: "Que luxo raro. Não normaliza o contrário depois." },
      { t: "Às vezes.", tone: "y", themes: { paz: "warn" },
        joke: "O “às vezes” carregando um relacionamento inteiro nas costas.",
        more: "Dúvida crônica não é profundidade. É o sistema pedindo uma conversa que você vem adiando." },
      { t: "Não.", tone: "y", themes: { paz: "bad" },
        joke: "Então não é namoro. É plantão.",
        more: "Se a paz só aparece no intervalo, o problema não é “pensar demais”. É o que acontece quando vocês estão juntos." },
      { t: "Não se aplica.", tone: "g", themes: {},
        joke: "Tudo se aplica. Mas tudo bem, próxima." }
    ]},
  { ch: 1, id: "admira",
    q: "Você admira quem essa pessoa é hoje. ou está esperando que ela vire quem prometeu ser?",
    opts: [
      { t: "Admiro quem ela é hoje.", tone: "g", themes: { admiracao: "good" },
        joke: "Admirar o presente. Conceito revolucionário." },
      { t: "Estou dividido entre a realidade e o potencial.", tone: "y", themes: { potencial: "warn" },
        joke: "Potencial não lava louça e não pede desculpa.",
        more: "Gostar do que alguém poderia ser é um projeto. Relação é com quem está na sala agora." },
      { t: "Estou principalmente esperando que ela mude.", tone: "y", themes: { potencial: "bad" },
        joke: "Você não namora. Você administra uma reforma.",
        more: "Gente não é obra. Se a aposta é a versão futura, vale perguntar o que te prende à atual." },
      { t: "Não se aplica.", tone: "g", themes: {},
        joke: "Se não se aplica, por que a pergunta latejou?" }
    ]},
  { ch: 1, id: "amigo",
    q: "Se uma pessoa amiga estivesse numa relação igual à sua, você torceria para o casal ficar junto?",
    opts: [
      { t: "Sim.", tone: "g", themes: { escolha: "good" },
        joke: "Boa. Agora usa a mesma régua com você." },
      { t: "Talvez.", tone: "y", themes: { escolha: "warn" },
        joke: "Talvez é o não com educação de aniversário.",
        more: "Você protegeria o amigo. A pergunta é por que a proteção some quando o caso é o seu." },
      { t: "Não.", tone: "y", themes: { escolha: "bad" },
        joke: "Resgate para o amigo. Cativeiro para você.",
        more: "Se você não recomendaria isso a alguém que ama, não precisa chamar de destino quando acontece com você." },
      { t: "Não sei responder.", tone: "y", themes: { escolha: "warn" },
        joke: "Não saber já é um dado.",
        more: "Gente segura costuma saber se torceria. A hesitação merece um lugar na mesa." }
    ]},
  { ch: 1, id: "hoje",
    q: "Se você conhecesse essa pessoa hoje, sabendo tudo o que sabe… ainda puxaria assunto?",
    opts: [
      { t: "Com certeza.", tone: "g", themes: { escolha: "good" },
        joke: "Consentimento informado. Quase sofisticado." },
      { t: "Talvez.", tone: "y", themes: { escolha: "warn" },
        joke: "O “talvez” de novo. Ele trabalha demais neste site.",
        more: "Se a reprise já não convence, o que te segura não é descoberta. É hábito." },
      { t: "Acho que não.", tone: "y", themes: { escolha: "bad" },
        joke: "O corpo votou. A cabeça está fazendo recontagem.",
        more: "Conhecer agora, com o dossiê aberto, e recuar: isso não é frieza. É informação." },
      { t: "Eu atravessaria a rua.", tone: "y", themes: { escolha: "bad" },
        joke: "A calçada sendo mais honesta que o relacionamento.",
        more: "Se a primeira reação é desvio, vale perguntar o que você está desviando. e por que ainda divide a casa com isso." }
    ]},
  { ch: 1, id: "sozinho",
    q: "Você quer realmente estar nesta relação. ou tem mais medo de ficar sozinho?",
    opts: [
      { t: "Quero estar nesta relação.", tone: "g", themes: { escolha: "good" },
        joke: "Querer é diferente de agarrar. Se for querer, segue." },
      { t: "É uma combinação das duas coisas.", tone: "y", themes: { apego: "warn" },
        joke: "Desejo e medo de cadeira vazia na mesma cama.",
        more: "Medo de ficar só consegue imitar escolha durante anos. Não é o mesmo músculo." },
      { t: "Tenho mais medo de ficar sozinho.", tone: "y", themes: { apego: "bad" },
        joke: "Então o namoro é coleira. E a coleira está no seu pescoço.",
        more: "Companhia contra o vazio não é relação. É anestesia. Anestesia tem efeito colateral." },
      { t: "Não sei responder.", tone: "y", themes: { apego: "warn" },
        joke: "Se não sabe se quer, já não está querendo o bastante." }
    ]},
  { ch: 1, id: "potencial",
    q: "Você está apaixonado pela pessoa real ou pelo potencial dela?",
    opts: [
      { t: "Pela realidade.", tone: "g", themes: { potencial: "good" },
        joke: "Ama o que existe. Adulto em extinção." },
      { t: "Pelos dois.", tone: "g", themes: { potencial: "warn" },
        joke: "Todo mundo tempera. O problema é quando o tempero vira o prato." },
      { t: "Principalmente pelo potencial.", tone: "y", themes: { potencial: "bad" },
        joke: "Você não está apaixonado. Está roteirizando.",
        more: "Personagem é fácil de amar. Pessoa de carne atrapalha o roteiro. e é com ela que você acorda." },
      { t: "Não sei responder.", tone: "y", themes: { potencial: "warn" },
        joke: "Se precisa pensar demais, já não é só a pessoa." }
    ]},
  { ch: 1, id: "afeto",
    q: "Vocês têm momentos genuínos de afeto e carinho que não envolvem sexo?",
    opts: [
      { t: "Frequentemente.", tone: "g", themes: { afeto: "good" },
        joke: "Carinho sem fatura. Guarda isso." },
      { t: "Às vezes.", tone: "y", themes: { afeto: "warn" },
        joke: "Às vezes não constrói casa. Constrói saudade de casa.",
        more: "Afeto intermitente vicia do mesmo jeito que atenção intermitente. Vale olhar a frequência, não o destaque." },
      { t: "Raramente ou nunca.", tone: "y", themes: { afeto: "bad" },
        joke: "Então a intimidade de vocês é uma transação.",
        more: "Sexo pode ser ótimo e ainda assim deixar fome. A fome aqui é de ser tocado sem ter que render." },
      { t: "Não se aplica.", tone: "g", themes: {},
        joke: "Se não se aplica, alguém está com fome de pele e chamando isso de “fase”." }
    ]},
  { ch: 2, id: "carregar",
    q: "Essa pessoa está crescendo junto com você. ou você a está carregando nas costas?",
    opts: [
      { t: "Estamos crescendo juntos.", tone: "g", themes: { reciprocidade: "good" },
        joke: "Parceria. Palavra feia de tão rara." },
      { t: "A relação é desequilibrada em alguns aspectos.", tone: "y", themes: { reciprocidade: "warn" },
        joke: "“Alguns aspectos” é o eufemismo do seu cansaço.",
        more: "Desequilíbrio pontual acontece. Desequilíbrio como clima da casa é outra conversa." },
      { t: "Sinto que estou carregando a pessoa.", tone: "y", themes: { reciprocidade: "bad" },
        joke: "Carga não é romance. É logística.",
        more: "Quem carrega sozinho acaba odiando o peso e culpando o amor. São coisas diferentes." },
      { t: "Não sei responder.", tone: "y", themes: { reciprocidade: "warn" },
        joke: "Se a dúvida é “será que eu carrego?”, você já está suando." }
    ]},
  { ch: 2, id: "curiosidade",
    q: "Essa pessoa demonstra curiosidade pelos seus interesses?",
    opts: [
      { t: "Frequentemente.", tone: "g", themes: { reciprocidade: "good" },
        joke: "Curiosidade é desejo com educação." },
      { t: "Às vezes.", tone: "y", themes: { reciprocidade: "warn" },
        joke: "Às vezes é o mínimo para não parecer monstro.",
        more: "Interesse real pergunta de novo. Interesse de fachada pergunta uma vez e muda de assunto." },
      { t: "Raramente ou nunca.", tone: "y", themes: { reciprocidade: "bad" },
        joke: "Você é cenário. Figurante na própria vida.",
        more: "Não ser perguntado sobre o que te anima é uma forma educada de desaparecer na presença de alguém." },
      { t: "Não sei responder.", tone: "y", themes: { reciprocidade: "warn" },
        joke: "Se você caça sinal de interesse, o interesse já sumiu." }
    ]},
  { ch: 2, id: "atencao",
    q: "Essa pessoa presta atenção no que você diz. ou esquece as histórias que você já contou?",
    opts: [
      { t: "Presta atenção.", tone: "g", themes: { comunicacao: "good" },
        joke: "Ser ouvido é uma forma cara de amor." },
      { t: "Às vezes esquece.", tone: "g", themes: { comunicacao: "warn" },
        joke: "Esquecer acontece. Apagar você, não." },
      { t: "Esquece constantemente.", tone: "y", themes: { comunicacao: "bad" },
        joke: "Não é memória ruim. É prioridade.",
        more: "O que a gente ama, a gente guarda torto, mas guarda. Sumir das histórias é um recado." },
      { t: "Não sei responder.", tone: "y", themes: { comunicacao: "warn" },
        joke: "Você sabe. Só está sendo educado com quem te ignora." }
    ]},
  { ch: 2, id: "conquistas",
    q: "Essa pessoa celebra suas conquistas individuais. ou só anima quando faz parte da equação?",
    opts: [
      { t: "Celebra minhas conquistas por mim.", tone: "g", themes: { reciprocidade: "good" },
        joke: "Torcida sem comissão. Gente grande." },
      { t: "Faz as duas coisas.", tone: "g", themes: { reciprocidade: "warn" },
        joke: "Desde que o “eu também” não roube o palco toda vez." },
      { t: "Só demonstra entusiasmo quando está envolvida.", tone: "y", themes: { reciprocidade: "bad" },
        joke: "Seu sucesso só existe se ela puder postar junto.",
        more: "Comemorar o outro sem entrar na foto é um teste simples. Muita gente reprova e chama de “casal”." },
      { t: "Não sei responder.", tone: "y", themes: { reciprocidade: "warn" },
        joke: "Pensa na última coisa boa que te aconteceu. A reação dela já está no tape." }
    ]},
  { ch: 2, id: "sonhos",
    q: "Suas ideias e seus sonhos são bem-recebidos. ou constantemente questionados?",
    opts: [
      { t: "São bem-recebidos.", tone: "g", themes: { identidade: "good" },
        joke: "Casa que cabe sonho alheio é casa." },
      { t: "Às vezes são questionados de forma construtiva.", tone: "g", themes: { identidade: "good" },
        joke: "Questionar para fortalecer é amor. O outro esporte tem outro nome." },
      { t: "São constantemente questionados ou desvalorizados.", tone: "y", themes: { identidade: "bad" },
        joke: "Alguém está podando você e chamando isso de realismo.",
        more: "Ceticismo pontual ajuda. Ceticismo como clima faz a pessoa menor. Observe o tamanho que você fica depois de falar um plano." },
      { t: "Não sei responder.", tone: "y", themes: { identidade: "warn" },
        joke: "Se você já encolhe o sonho antes de falar, a censura já mora aí." }
    ]},
  { ch: 2, id: "explicar",
    q: "Você se sente compreendido. ou precisa se explicar o tempo todo?",
    opts: [
      { t: "Sinto-me compreendido.", tone: "g", themes: { comunicacao: "good" },
        joke: "Ser entendido é descanso. Não troca por tesão de discussão." },
      { t: "Às vezes preciso me explicar.", tone: "g", themes: { comunicacao: "warn" },
        joke: "Explicar de vez em quando é relação. Explicar sempre é tribunal." },
      { t: "Preciso me explicar constantemente.", tone: "y", themes: { comunicacao: "bad" },
        joke: "Você está em depoimento permanente.",
        more: "Quem precisa traduzir a própria existência o dia inteiro não está em diálogo. Está em defesa." },
      { t: "Não sei responder.", tone: "y", themes: { comunicacao: "warn" },
        joke: "Cansaço de se explicar geralmente vem disfarçado de “não sei”." }
    ]},
  { ch: 2, id: "decifrar",
    q: "Essa pessoa consegue comunicar o que sente. ou você precisa decifrar o que ela pensa?",
    opts: [
      { t: "Ela comunica o que sente.", tone: "g", themes: { comunicacao: "good" },
        joke: "Comunicação adulta. Espécie ameaçada." },
      { t: "Às vezes preciso interpretar.", tone: "g", themes: { comunicacao: "warn" },
        joke: "Todo mundo tem dia mudo. O problema é virar língua antiga." },
      { t: "Preciso quase sempre decifrar o que ela pensa.", tone: "y", themes: { comunicacao: "bad" },
        joke: "Você não é médium. E essa vaga não paga extra.",
        more: "Adivinhar o outro como ofício vira ansiedade com desculpa romântica. Você não precisava dessa função." },
      { t: "Não sei responder.", tone: "y", themes: { comunicacao: "warn" },
        joke: "Se você vive adivinhando, já tem a resposta." }
    ]},
  { ch: 3, id: "facil",
    q: "Esta relação tem deixado sua vida mais fácil ou mais difícil?",
    opts: [
      { t: "Mais fácil.", tone: "g", themes: { impacto: "good" },
        joke: "Parceria que reduz atrito. É para isso que serve." },
      { t: "Nem mais fácil nem mais difícil.", tone: "g", themes: { impacto: "warn" },
        joke: "Neutro pode ser paz. Ou dessensibilização com nome bonito." },
      { t: "Mais difícil.", tone: "y", themes: { impacto: "bad" },
        joke: "Amor que só complica não é profundidade. É custo operacional.",
        more: "Relação boa também cansa. A diferença é se o cansaço constrói alguma coisa ou só cobra pedágio." },
      { t: "Não sei responder.", tone: "y", themes: { impacto: "warn" },
        joke: "Compara sua semana agora com a de dois anos atrás. A folha não mente." }
    ]},
  { ch: 3, id: "saudade",
    q: "Quando você está longe dessa pessoa, sente saudade de verdade. ou principalmente apego?",
    opts: [
      { t: "Sinto saudade genuína.", tone: "g", themes: { apego: "good" },
        joke: "Saudade que aquece é um voto. Apego que aperta é outro." },
      { t: "Sinto as duas coisas.", tone: "y", themes: { apego: "warn" },
        joke: "Uma parte te quer. Outra te prende.",
        more: "Mistura é humana. O ponto é qual das duas manda quando a relação aperta." },
      { t: "Sinto principalmente apego.", tone: "y", themes: { apego: "bad" },
        joke: "Apego é vício com álibi romântico.",
        more: "Falta que irrita, não aquece, costuma ser abstinência. não saudade. Vale separar as duas antes de uma decisão grande." },
      { t: "Não sei responder.", tone: "y", themes: { apego: "warn" },
        joke: "Se a falta parece irritação, não é saudade." }
    ]},
  { ch: 3, id: "alivio",
    q: "Nos dias em que vocês ficam separados, você se sente mais descansado?",
    opts: [
      { t: "Não.", tone: "g", themes: { alivio: "good" },
        joke: "Ótimo. Ausência ainda não virou tratamento terapêutico." },
      { t: "Às vezes.", tone: "y", themes: { alivio: "warn" },
        joke: "Interessante. Seu sistema nervoso pediu para participar do questionário.",
        more: "Alívio ocasional pode ser só cansaço de convivência. Alívio que se repete é um recado sobre o que acontece quando vocês estão no mesmo cômodo." },
      { t: "Sim.", tone: "y", themes: { alivio: "bad" },
        joke: "Tá. Essa resposta merece menos piada e mais atenção.",
        more: "Quando estar longe de alguém traz alívio recorrente, vale investigar o que exatamente está te desgastando quando vocês estão juntos." },
      { t: "Não sei responder.", tone: "y", themes: { alivio: "warn" },
        joke: "Se o ombro cai quando o Uber dela chega, você sabe." }
    ]},
  { ch: 3, id: "corpo",
    q: "Desde que essa relação começou, você percebeu mudanças persistentes no sono, na ansiedade, na energia ou no bem-estar que parecem ligadas à dinâmica entre vocês?",
    opts: [
      { t: "Não. Continuo mais ou menos o mesmo.", tone: "g", themes: { nervoso: "good" },
        joke: "Seu dermatologista agradece por não entrar nessa DR sem provas." },
      { t: "Mudanças leves, nada que eu associe com clareza.", tone: "g", themes: { nervoso: "warn" },
        joke: "Correlação não é culpa. Também não é motivo para fingir que o corpo cala." },
      { t: "Sim. Percebo um padrão que parece ligado a nós.", tone: "y", themes: { nervoso: "bad" },
        joke: "O organismo vazou o que a boca ainda negocia.",
        more: "Isso não prova que a pessoa é o vilão. Prova que a dinâmica está custando caro no lugar errado. Vale olhar com calma. e, se fizer sentido, com ajuda." },
      { t: "Não sei responder.", tone: "y", themes: { nervoso: "warn" },
        joke: "Olha uma semana típica. Sono, estômago, paciência. O corpo costuma votar primeiro." }
    ]},
  { ch: 3, id: "dinheiro",
    q: "Sua vida financeira e a sua relação com o dinheiro mudaram, nesta relação, de um jeito que te preocupa?",
    opts: [
      { t: "Não. Melhorou ou ficou estável.", tone: "g", themes: { dinheiro: "good" },
        joke: "Dinheiro alinhado é raro. Não romantiza o contrário." },
      { t: "Não houve mudança relevante.", tone: "g", themes: { dinheiro: "good" },
        joke: "Estável ok. Desde que estável não seja tapar buraco calado." },
      { t: "Sim. Piorou de um jeito que me preocupa.", tone: "y", themes: { dinheiro: "bad" },
        joke: "Amor que desorganiza a conta não é paixão. É rombo com apelido.",
        more: "Dinheiro aqui não é moralismo. É ver se a relação pede um preço que você não combinou. inclusive o preço de não poder sair." },
      { t: "Prefiro não responder.", tone: "g", themes: {},
        joke: "Respeito. Se a pergunta doeu, anota a dor mesmo assim." }
    ]},
  { ch: 3, id: "provar",
    q: "Você se sente amado por quem é. ou precisa fazer alguma coisa para receber amor?",
    opts: [
      { t: "Sinto-me amado por quem sou.", tone: "g", themes: { valor: "good" },
        joke: "Amor sem audição. Não troca isso por plot twist." },
      { t: "Às vezes sinto que preciso provar meu valor.", tone: "y", themes: { valor: "warn" },
        joke: "Provar valor é entrevista de emprego, não namoro.",
        more: "Se o afeto depende de desempenho, o desempenho nunca acaba. Esse é o truque." },
      { t: "Sinto que preciso fazer algo para receber amor.", tone: "y", themes: { valor: "bad" },
        joke: "Você não é fliperama.",
        more: "Amor com ficha é economia. Economia cansa. Você não precisava ganhar o básico de novo toda semana." },
      { t: "Não sei responder.", tone: "y", themes: { valor: "warn" },
        joke: "Se a dúvida existe, a prova já está sendo cobrada." }
    ]},
  { ch: 4, id: "gostos",
    q: "Você ainda sabe quais livros, músicas, séries e filmes gosta sozinho. ou só reconhece o que compartilham?",
    opts: [
      { t: "Continuo conhecendo bem os meus gostos.", tone: "g", themes: { identidade: "good" },
        joke: "O eu intacto dentro do nós. É o jogo." },
      { t: "Tenho certa dificuldade em separar as preferências.", tone: "y", themes: { identidade: "warn" },
        joke: "Fusão demais vira desaparecimento. Quem escolhe o filme agora?",
        more: "Misturar gosto é íntimo. Perder o próprio é outra operação. A diferença aparece no sábado à tarde, sozinho." },
      { t: "Quase só identifico os gostos que compartilham.", tone: "y", themes: { identidade: "bad" },
        joke: "Você terceirizou o paladar. Sobrou o casal.",
        more: "Personalidade compartilhada demais deixa uma pessoa sem mapa quando a relação treme. Vale recuperar uma coisa que é só sua. nesta semana." },
      { t: "Não sei responder.", tone: "y", themes: { identidade: "warn" },
        joke: "Cita três coisas que você ama e a pessoa detesta. Se travou, já era." }
    ]},
  { ch: 4, id: "investigar",
    q: "Essa pessoa te instiga a investigar quem você é. ou a provar quem você é?",
    opts: [
      { t: "Incentiva minha autodescoberta.", tone: "g", themes: { identidade: "good" },
        joke: "Te expande. Não te vigia." },
      { t: "Faz as duas coisas.", tone: "y", themes: { identidade: "warn" },
        joke: "Uma hora espelho. Outra hora holofote de delegacia.",
        more: "Provação constante não é profundidade. É um emprego que você não assinou." },
      { t: "Sinto que preciso provar quem sou.", tone: "y", themes: { identidade: "bad" },
        joke: "Identidade não é contestação de paternidade.",
        more: "Se você entra em cada conversa precisando defender o próprio caráter, a relação já escolheu um tribunal como móvel." },
      { t: "Não sei responder.", tone: "y", themes: { identidade: "warn" },
        joke: "Provar quem você é já é um trabalho. Relação boa não abre essa vaga." }
    ]},
  { ch: 4, id: "familia",
    q: "Passar tempo com familiares e amigos dessa pessoa te traz principalmente alegria. ou obrigação?",
    opts: [
      { t: "Principalmente alegria.", tone: "g", themes: { identidade: "good" },
        joke: "Rede que acolhe. Não é detalhe." },
      { t: "Uma mistura de alegria e obrigação.", tone: "g", themes: { identidade: "warn" },
        joke: "Mistura é normal. Só obrigação com sorriso, não." },
      { t: "Principalmente obrigação.", tone: "y", themes: { identidade: "bad" },
        joke: "Serviço comunitário no tempo livre.",
        more: "Obrigação pontual faz parte. Obrigação como clima te tira de qualquer lugar que deveria ser seu também." },
      { t: "Não se aplica.", tone: "g", themes: {},
        joke: "Se não tem gente dela na mesa, às vezes o isolamento já é o recado." }
    ]},
  { ch: 4, id: "decidir",
    q: "Você toma suas decisões a partir de respeito por si. ou do medo de perder essa pessoa?",
    opts: [
      { t: "Principalmente do respeito por mim.", tone: "g", themes: { limites: "good" },
        joke: "Régua interna no lugar. Não empresta ela." },
      { t: "Das duas coisas.", tone: "y", themes: { limites: "warn" },
        joke: "Medo com gravata ainda é medo.",
        more: "Dá para amar e ainda assim decidir sem se anular. Se toda escolha grande nasce do susto de perder, o susto está no comando." },
      { t: "Principalmente do medo de perder.", tone: "y", themes: { limites: "bad" },
        joke: "Quem decide no susto aceita qualquer acordo.",
        more: "Medo de perda assina contrato ruim com letra bonita. Vale olhar o que você já aceitou só para não ver a cadeira vazia." },
      { t: "Não sei responder.", tone: "y", themes: { limites: "warn" },
        joke: "Se a decisão só existe quando a pessoa ameaça sair, já sabe a origem." }
    ]},
  { ch: 5, id: "emergencia",
    q: "Você colocaria essa pessoa como seu contato de emergência?",
    opts: [
      { t: "Sim, sem hesitar.", tone: "g", themes: { confianca: "good" },
        joke: "Isso é confiança. O resto é enfeite." },
      { t: "Talvez.", tone: "y", themes: { confianca: "warn" },
        joke: "Emergência não aceita talvez.",
        more: "Contato de emergência é uma pergunta sem poesia: na hora feia, essa pessoa aparece e sabe o que fazer?" },
      { t: "Não.", tone: "y", themes: { confianca: "bad" },
        joke: "Você divide a cama com alguém que não colocaria no formulário do hospital.",
        more: "Não é um teste moral. É um mapa de confiança prática. Se a resposta é não, isso merece espaço. sem discurso de “é porque eu sou independente”." },
      { t: "Não sei responder.", tone: "y", themes: { confianca: "warn" },
        joke: "Não saber já é um não com vergonha." }
    ]},
  { ch: 5, id: "confiar",
    q: "Você confiaria nessa pessoa para cuidar de alguém extremamente importante para você. quando você não pudesse supervisionar?",
    opts: [
      { t: "Sim.", tone: "g", themes: { confianca: "good" },
        joke: "Essa pergunta separa crush de caráter." },
      { t: "Talvez.", tone: "y", themes: { confianca: "warn" },
        joke: "Talvez, neste caso, é um não que ainda está se vestindo.",
        more: "Confiança sem supervisão é um critério duro de propósito. Se trava, não force um sim por lealdade." },
      { t: "Não.", tone: "y", themes: { confianca: "bad" },
        joke: "Então por que você se entrega inteiro a quem não passaria nesse teste?",
        more: "A pergunta não é sobre filho. É sobre julgamento, cuidado e previsibilidade quando você não está na sala." },
      { t: "Não se aplica.", tone: "g", themes: {},
        joke: "Aplica como metáfora. Caráter não precisa de berço para aparecer." }
    ]},
  { ch: 5, id: "intimidade",
    q: "Se uma pessoa importante para você soubesse como é a intimidade de vocês, ficaria feliz com o seu futuro?",
    opts: [
      { t: "Sim.", tone: "g", themes: { confianca: "good" },
        joke: "Consegue ser vista. Isso importa mais do que parece." },
      { t: "Talvez.", tone: "y", themes: { confianca: "warn" },
        joke: "Se precisa esconder o quarto, o quarto já é o problema.",
        more: "Intimidade que não aguenta testemunha de alguém que te ama costuma esconder mais do que pudor." },
      { t: "Não.", tone: "y", themes: { confianca: "bad" },
        joke: "Vergonha de ser visto é um alarme. Não coloca no silencioso.",
        more: "Pensa em uma pessoa que te quer bem. A cara dela, imaginada, já respondeu metade." },
      { t: "Não sei responder.", tone: "y", themes: { confianca: "warn" },
        joke: "A cara da pessoa que te ama já respondeu. Você que desviou o olhar." }
    ]},
  { ch: 5, id: "seguranca", allowCustom: false,
    q: "Nesta relação, você já sentiu medo, ameaça, isolamento, controle. inclusive financeiro. coerção ou violência?",
    opts: [
      { t: "Não.", tone: "g", themes: { seguranca: "good" },
        joke: "Que continue assim. Essa é a linha que o site não atravessa de brincadeira." },
      { t: "Não tenho certeza se o que aconteceu entra nisso.", tone: "r", themes: { seguranca: "warn" },
        joke: "Sem piada agora.",
        more: "Dúvida neste ponto já merece conversa com alguém de confiança. Você não precisa classificar sozinho o que viveu. e não precisa decidir o futuro da relação nesta tela." },
      { t: "Sim.", tone: "r", themes: { seguranca: "bad" },
        joke: "Sem piada agora.",
        more: "Isso que você marcou pode ser sério. Você não precisa tomar nenhuma decisão neste momento. Vale falar com alguém em quem confie e considerar apoio especializado. Ligue 180 ou 188. Sua segurança não é punchline deste site." },
      { t: "Prefiro não responder.", tone: "g", themes: {},
        joke: "Tudo bem. A porta fica aberta. 180 e 188 existem se um dia fizer sentido." }
    ]},
  { ch: 5, id: "seamar",
    q: "Você se ama o suficiente para reconhecer se esta relação te faz bem?",
    opts: [
      { t: "Sim.", tone: "g", themes: { limites: "good" },
        joke: "Então usa a resposta. Não guarda ela na gaveta." },
      { t: "Estou aprendendo.", tone: "g", themes: { limites: "warn" },
        joke: "Aprender vale. Desde que aprender não seja adiar para sempre." },
      { t: "Ainda não.", tone: "y", themes: { limites: "bad" },
        joke: "Pelo menos foi honesto.",
        more: "O trabalho, então, não é consertar o outro nesta madrugada. É recuperar régua suficiente para olhar a relação sem se trair." },
      { t: "Não sei responder.", tone: "y", themes: { limites: "warn" },
        joke: "Não saber se se ama já é um recado. Começa por aí. não pelo crush." }
    ]}
];

const WRITES = [
  { id: "urgencia", q: "Por que você está tão preocupado em ter certeza de que é, ou será, amado?" },
  { id: "descobri", q: "O que você descobriu ao responder estas perguntas?" },
  { id: "preservar", q: "Quais aspectos positivos desta relação você quer preservar?" },
  { id: "preocupa", q: "O que te preocupa ou precisa mudar?" },
  { id: "conversa", q: "Que conversa você precisa ter. e com quem?" },
  { id: "limite", q: "Que limite você precisa estabelecer?" },
  { id: "apoio", q: "Que apoio você pode buscar?" },
  { id: "passo", q: "Qual será seu próximo passo. concreto, desta semana?" }
];

const SYN = [
  { id: "sinto", q: "Nesta relação, eu me sinto" },
  { id: "gostaria", q: "Eu gostaria de me sentir" },
  { id: "corpo", q: "O que meu corpo tem tentado me dizer é" },
  { id: "ignorar", q: "O que eu não quero mais ignorar é" },
  { id: "decisao", q: "Uma decisão que respeitaria mais a mim seria" }
];

const LABELS = {
  paz: "Paz", admiracao: "Admiração", escolha: "Escolha", potencial: "Realidade × potencial",
  afeto: "Afeto", reciprocidade: "Reciprocidade", comunicacao: "Comunicação", impacto: "Peso na vida",
  apego: "Saudade e apego", alivio: "Alívio na ausência", nervoso: "Sistema nervoso", dinheiro: "Dinheiro",
  valor: "Valor próprio", identidade: "Identidade", limites: "Limites", confianca: "Confiança", seguranca: "Segurança"
};

const ROASTS = {
  reciprocidade: "Tem amor. Tem história. Tem carinho. Só aparentemente faltou contratar um segundo adulto para o relacionamento.",
  alivio: "Você não odeia a pessoa. Odeia o estado em que fica quando está com ela. São coisas diferentes.",
  potencial: "Você não está namorando alguém. Está namorando uma versão beta que nunca foi lançada.",
  identidade: "O casal está ótimo. Você que sumiu do elenco.",
  apego: "Não é lealdade. É recusa em dar baixa no investimento.",
  valor: "Você está pedindo um laudo de que é amado. Relação boa não exige perícia.",
  comunicacao: "Você não é médium. E essa vaga não paga extra.",
  paz: "Tem afeto. Tem história. Tem também um alarme que você vem silenciando com educação.",
  nervoso: "O corpo entrou no questionário sem ser convidado. Costuma ser o depoimento mais honesto da casa.",
  confianca: "Tem intimidade. Falta o tipo de confiança que a gente testa fora do quarto.",
  limites: "A relação pode até ter futuro. A sua régua precisa voltar para as suas mãos primeiro.",
  escolha: "Não faltou sentimento. Faltou admitir que ficar também é uma decisão. e que você anda terceirizando ela.",
  impacto: "A vida ficou mais cara. Não em dinheiro. Em paciência.",
  dinheiro: "O Pix não deveria ser prova de amor. Nem de permanência.",
  afeto: "Tem desejo. Falta o tipo de toque que não precisa de desculpa.",
  admiracao: "Difícil construir casa em cima de uma pessoa que você ainda está esperando nascer.",
  ok: "Provavelmente não é uma bosta. Também não é motivo para desligar o cérebro.",
  mix: "Tem coisa boa demais para jogar fora. e coisa ruim demais para fingir que não viu."
};

const BLURB = {
  reciprocidade: "Em várias respostas, você parece assumir mais responsabilidade pela relação do que a outra pessoa.",
  alivio: "Você relatou sentir-se melhor, com alguma frequência, quando estão separados.",
  nervoso: "Apareceu um padrão de desgaste no corpo. sono, ansiedade, energia. que você associa à dinâmica de vocês.",
  potencial: "A atração parece pendurar mais no que essa pessoa poderia ser do que no que ela é.",
  identidade: "Em mais de um ponto, o “nós” parece ter comido espaço do “eu”.",
  apego: "O que te segura pode ser menos escolha e mais medo da ausência.",
  valor: "O afeto, nas suas marcas, às vezes depende de desempenho.",
  comunicacao: "Você relata traduzir, adivinhar ou se explicar mais do que deveria ser necessário.",
  paz: "A relação não está entregando paz com a frequência que uma vida em comum pede.",
  escolha: "Ficar parece menos decisão e mais inércia.",
  confianca: "Há intimidade. A confiança prática. a de emergência, a de cuidado. emperrou.",
  limites: "O medo de perder está pesando nas suas decisões.",
  impacto: "A vida ficou mais difícil desde que essa relação ocupa o centro.",
  dinheiro: "O dinheiro entrou na conversa de um jeito que te preocupa.",
  afeto: "O carinho fora do sexo não está tão disponível quanto você precisaria.",
  admiracao: "A admiração pelo presente não está firme.",
  seguranca: "Há um sinal de medo, controle ou violência. Isso não entra em roast."
};

const {
  CUSTOM_ANSWER,
  CUSTOM_ANSWER_MAX_CHARS,
  collectCustomAnswers: collectCustomAnswersFromState,
  commentPayload: buildCommentPayload,
  createEmptyState,
  hasValidCustomAnswer: customAnswerIsValid,
  normalizeState,
  patterns: calculatePatterns,
  safetyLocked: stateSafetyLocked,
  safetyModeAt: stateSafetyModeAt,
  validCustomAnalysis
} = SneubCore;
const KEY = "sneub-v3";
const JEV_TIMEOUT_MS = 5000;
const COMMENT_TIMEOUT_MS = 8500;
const COMMENT_CACHE_LIMIT = 64;
const COMMENT_SAFETY_TEXT = "Sem piada agora. O que você marcou pode ser sério. Isso merece apoio real, não um roast.";
const commentCache = new Map();
let commentRequest = null;
let commentRequestSerial = 0;
let commentSessionId = null;
let analysisRequest = null;
let renderingHistory = false;

function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? normalizeState(JSON.parse(raw)) : createEmptyState();
  } catch {
    return createEmptyState();
  }
}

const state = loadState();
const $ = (id) => document.getElementById(id);

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
}

function setChrome(mode, label) {
  const word = $("wordmark");
  const step = $("step");
  if (!word || !step) return;
  if (mode === "home") {
    word.hidden = false;
    word.textContent = "S.N.E.U.B.";
    step.hidden = true;
    step.textContent = "";
  } else {
    word.hidden = true;
    step.hidden = false;
    step.textContent = label;
  }
}

function routeForQuestion(item) {
  return `#question=${encodeURIComponent(item.id)}`;
}

function setRoute(hash, replace = false) {
  if (renderingHistory) return;
  if (window.location.hash === hash) {
    if (replace && (!window.history.state || !window.history.state.sneub)) {
      window.history.replaceState({ sneub: true, internal: false }, "", hash);
    }
    return;
  }
  window.history[replace ? "replaceState" : "pushState"](
    { sneub: true, internal: !replace },
    "",
    hash
  );
}

function show(id, hash, replace = false) {
  document.querySelectorAll(".screen").forEach((s) => {
    s.classList.remove("on", "grave");
    s.setAttribute("aria-hidden", s.id === id ? "false" : "true");
  });
  $(id).classList.add("on");
  if (hash) setRoute(hash, replace);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "instant" });
}

function goBack(fallback) {
  if (window.history.state && window.history.state.sneub && window.history.state.internal) {
    window.history.back();
    return;
  }
  fallback();
}

function safetyLocked() {
  return stateSafetyLocked(Q, state);
}

function allowsCustomAnswer(q) {
  return SneubCore.allowsCustomAnswer(q);
}

function hasValidCustomAnswer(q) {
  return customAnswerIsValid(state, q);
}

function safetyModeAt(index) {
  return stateSafetyModeAt(Q, state, index);
}

function cancelCommentRequest() {
  if (commentRequest) commentRequest.controller.abort();
  commentRequest = null;
}

function commentSession() {
  if (commentSessionId) return commentSessionId;
  try {
    commentSessionId = sessionStorage.getItem("sneub-comment-session");
    if (!commentSessionId) {
      commentSessionId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
      sessionStorage.setItem("sneub-comment-session", commentSessionId);
    }
  } catch (_) {
    commentSessionId = "anonymous";
  }
  return commentSessionId;
}

function commentPayload(item, idx) {
  return buildCommentPayload(Q, state, item, idx);
}

function renderLocalReaction(option, safety = false) {
  const box = $("react");
  if (!box) return;
  box.classList.add("on");
  box.replaceChildren();
  const joke = document.createElement("p");
  joke.className = `joke${safety || option.tone === "r" ? " red" : ""}`;
  joke.textContent = safety && option.tone !== "r" ? COMMENT_SAFETY_TEXT : option.joke;
  box.appendChild(joke);
  if (!safety && option.more) {
    const more = document.createElement("p");
    more.className = "more";
    more.textContent = option.more;
    box.appendChild(more);
  }
}

function renderAgentComment(comment) {
  const box = $("react");
  if (!box) return;
  box.classList.add("on");
  box.replaceChildren();
  const joke = document.createElement("p");
  joke.className = "joke";
  joke.textContent = comment;
  box.appendChild(joke);
}

function renderCustomReaction() {
  const box = $("react");
  if (!box) return;
  box.classList.add("on");
  box.replaceChildren();
  const joke = document.createElement("p");
  joke.className = "joke";
  joke.textContent = "Tá. Então escreve do seu jeito.";
  box.appendChild(joke);
}

function validAgentComment(value) {
  if (!value || typeof value.comment !== "string" || value.kind !== "roast") return null;
  const comment = value.comment.trim().replace(/\s+/g, " ");
  if (!comment || comment.length > 280 || /[<>\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(comment)) return null;
  return comment;
}

function commentIsCurrent(item, idx, requestId) {
  return commentRequest && commentRequest.id === requestId &&
    state.i === Q.indexOf(item) && state.a[item.id] === idx && $("react");
}

async function requestAgentComment(item, idx) {
  const index = Q.indexOf(item);
  if (index < 0 || item.id === "seguranca" || safetyModeAt(index)) return;
  const payload = commentPayload(item, idx);
  const cacheKey = JSON.stringify(payload);
  cancelCommentRequest();
  if (commentCache.has(cacheKey)) {
    renderAgentComment(commentCache.get(cacheKey));
    return;
  }

  const controller = new AbortController();
  const requestId = ++commentRequestSerial;
  commentRequest = { controller, id: requestId };
  const timeout = setTimeout(() => controller.abort(), COMMENT_TIMEOUT_MS);
  try {
    const response = await fetch("/api/comment", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-sneub-session": commentSession()
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    if (!response.ok) return;
    const comment = validAgentComment(await response.json());
    if (!comment) return;
    commentCache.set(cacheKey, comment);
    if (commentCache.size > COMMENT_CACHE_LIMIT) commentCache.delete(commentCache.keys().next().value);
    if (commentIsCurrent(item, idx, requestId)) renderAgentComment(comment);
  } catch (_) {
    // The local comment is the deliberate fallback for offline, slow, or failed calls.
  } finally {
    clearTimeout(timeout);
    if (commentRequest && commentRequest.id === requestId) commentRequest = null;
  }
}

function patterns(customAnalysis) {
  return calculatePatterns(Q, state, customAnalysis);
}

function roastLine(rows, locked) {
  if (locked) return "Este card fica em branco de propósito. Segurança não vira meme.";
  if (!rows.length) return ROASTS.ok;
  const top = rows[0];
  if (top.heat < 0.3) return ROASTS.ok;
  return ROASTS[top.k] || ROASTS.mix;
}

function renderHome(options = {}) {
  setChrome("home");
  $("home").innerHTML = `
    <p class="tiny" style="margin-top:22px">Este site não conhece seu namorado.<br>
    <strong style="color:var(--ink);font-family:'Archivo Black',sans-serif;text-transform:uppercase;letter-spacing:-.02em">Você, infelizmente, conhece.</strong></p>
    <h1 class="poster">Seu<br>namoro<br>é uma<br><em>bosta?</em></h1>
    <p class="aside">5 minutos. Algumas perguntas inconvenientes. No final, talvez o problema seja seu namoro. Talvez seja você. Talvez sejam os dois.</p>
    <div class="whispers">
      <span>[ provavelmente não ]</span>
      <span>[ mas vamos descobrir ]</span>
    </div>
    <button class="cta hot" id="go" type="button" style="margin-top:36px">Descobrir a desgraça</button>
    <p class="privacy-brief">Sem cadastro. Alternativas podem gerar comentários por IA. Texto livre só sai deste aparelho com sua autorização.</p>
    <p class="footer-dis">Isto não é avaliação clínica e não substitui apoio profissional. Algumas respostas fechadas podem ser processadas para gerar comentários. Respostas escritas só são enviadas se você escolher usar a análise com IA.</p>
  `;
  show("home", "#screen=home", options.replace === true);
  $("go").onclick = renderQ;
  $("go").focus();
}

function setQuestionSelection(value) {
  const expected = String(value);
  const radios = [...$("q").querySelectorAll('[role="radio"]')];
  const selected = radios.findIndex((button) => button.dataset.answer === expected);
  const tabbable = selected >= 0 ? selected : 0;
  radios.forEach((button, index) => {
    const checked = index === selected;
    button.setAttribute("aria-checked", checked ? "true" : "false");
    button.tabIndex = index === tabbable ? 0 : -1;
  });
}

function setCustomValidation(item, announce = false) {
  const textarea = $("custom-answer");
  const error = $("custom-error");
  const next = $("next");
  if (!textarea || !error || !next) return false;
  const valid = hasValidCustomAnswer(item);
  textarea.setAttribute("aria-invalid", valid || !announce ? "false" : "true");
  error.hidden = valid || !announce;
  next.disabled = !valid;
  return valid;
}

function setCustomEditorActive(item, active, focus = false) {
  const box = $("custombox");
  const textarea = $("custom-answer");
  if (!box || !textarea) return;
  box.hidden = !active;
  textarea.disabled = !active;
  if (active) {
    textarea.value = state.c[item.id] || "";
    const count = $("custom-count");
    if (count) count.textContent = `${textarea.value.length} / ${CUSTOM_ANSWER_MAX_CHARS}`;
    setCustomValidation(item, false);
    if (focus) textarea.focus();
  }
}

function pickOption(item, idx) {
  state.a[item.id] = idx;
  save();
  setQuestionSelection(idx);
  setCustomEditorActive(item, false);
  const safety = safetyModeAt(Q.indexOf(item));
  cancelCommentRequest();
  renderLocalReaction(item.opts[idx], safety);
  if (item.id !== "seguranca" && !safety) requestAgentComment(item, idx);
  const next = $("next");
  next.disabled = false;
  $("q").classList.remove("has-sticky-nav");
  const nav = $("question-nav");
  if (nav) nav.classList.remove("custom-sticky");
}

function pickCustomAnswer(item, focus = true) {
  if (!allowsCustomAnswer(item)) return;
  cancelCommentRequest();
  state.a[item.id] = CUSTOM_ANSWER;
  save();
  setQuestionSelection(CUSTOM_ANSWER);
  setCustomEditorActive(item, true, focus);
  renderCustomReaction();
  $("q").classList.add("has-sticky-nav");
  $("question-nav").classList.add("custom-sticky");
  setCustomValidation(item, false);
}

function renderQ(options = {}) {
  const i = state.i;
  if (i >= Q.length) return renderWrites();
  const item = Q[i];
  const picked = state.a[item.id];
  const customPicked = picked === CUSTOM_ANSWER && allowsCustomAnswer(item);
  const opt = Number.isInteger(picked) ? item.opts[picked] : null;
  const n = String(i + 1).padStart(2, "0");
  const total = String(Q.length).padStart(2, "0");
  const grave = item.ch === 5;
  setChrome("step", n + " / " + total);

  $("q").innerHTML = `
    <p class="sr-only" id="qstatus">Pergunta ${i + 1} de ${Q.length}. ${CHAPTERS[item.ch]}</p>
    <div class="chap"><span>Cap. ${item.ch}</span> ${CHAPTERS[item.ch].replace(/^Capítulo \d+\. /, "")}</div>
    <h1 class="q" id="q-title" tabindex="-1">${item.q}</h1>
    <div class="opts" id="opts" role="radiogroup" aria-labelledby="q-title" aria-describedby="qstatus"></div>
    ${allowsCustomAnswer(item) ? `
      <div class="custom-answer" id="custombox" hidden>
        <label for="custom-answer">Escreve do seu jeito.</label>
        <textarea id="custom-answer" maxlength="${CUSTOM_ANSWER_MAX_CHARS}" required aria-describedby="custom-answer-help custom-error custom-count" aria-invalid="false"></textarea>
        <div class="custom-meta">
          <span id="custom-answer-help">Fica neste aparelho até você autorizar a análise.</span>
          <span id="custom-count">0 / ${CUSTOM_ANSWER_MAX_CHARS}</span>
        </div>
        <p class="field-error" id="custom-error" role="alert" hidden>Escreve alguma coisa além de espaços para seguir.</p>
      </div>` : ""}
    <div class="react ${opt || customPicked ? "on" : ""}" id="react" aria-live="polite"></div>
    <div class="nav${customPicked ? " custom-sticky" : ""}" id="question-nav">
      <button class="cta" id="next" type="button" ${picked == null || (customPicked && !hasValidCustomAnswer(item)) ? "disabled" : ""}>${i === Q.length - 1 ? "Escrever o resto" : "Seguir"}</button>
      <button class="cta line" id="back" type="button">${i === 0 ? "Capa" : "Voltar"}</button>
    </div>
  `;
  $("q").classList.toggle("has-sticky-nav", customPicked);
  const group = $("opts");
  item.opts.forEach((o, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "opt";
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", picked === idx ? "true" : "false");
    btn.tabIndex = -1;
    btn.dataset.answer = String(idx);
    const mark = document.createElement("span");
    mark.className = "mark";
    mark.setAttribute("aria-hidden", "true");
    const txt = document.createElement("span");
    txt.textContent = o.t;
    btn.append(mark, txt);
    btn.addEventListener("click", () => pickOption(item, idx));
    group.appendChild(btn);
  });
  if (allowsCustomAnswer(item)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "opt custom-opt";
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", customPicked ? "true" : "false");
    btn.tabIndex = -1;
    btn.dataset.answer = CUSTOM_ANSWER;
    const mark = document.createElement("span");
    mark.className = "mark";
    mark.setAttribute("aria-hidden", "true");
    const txt = document.createElement("span");
    txt.textContent = "Outra resposta…";
    btn.append(mark, txt);
    btn.addEventListener("click", () => pickCustomAnswer(item));
    group.appendChild(btn);

    const textarea = $("custom-answer");
    textarea.value = state.c[item.id] || "";
    textarea.addEventListener("input", () => {
      state.c[item.id] = textarea.value;
      save();
      $("custom-count").textContent = `${textarea.value.length} / ${CUSTOM_ANSWER_MAX_CHARS}`;
      setCustomValidation(item, false);
    });
    textarea.addEventListener("blur", () => setCustomValidation(item, true));
    setCustomEditorActive(item, customPicked);
  }
  setQuestionSelection(picked == null ? "" : picked);
  group.addEventListener("keydown", (e) => {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const radios = [...group.querySelectorAll('[role="radio"]')];
    const focused = radios.indexOf(document.activeElement);
    const checked = radios.findIndex((r) => r.getAttribute("aria-checked") === "true");
    const start = focused >= 0 ? focused : (checked >= 0 ? checked : 0);
    const dir = (e.key === "ArrowDown" || e.key === "ArrowRight") ? 1 : -1;
    const next = e.key === "Home" ? 0 : e.key === "End" ? radios.length - 1 :
      (start + dir + radios.length) % radios.length;
    radios[next].click();
    radios[next].focus();
  });

  show("q", routeForQuestion(item), options.replace === true);
  if (grave) $("q").classList.add("grave");
  if (customPicked) {
    cancelCommentRequest();
    renderCustomReaction();
  } else if (opt) {
    const safety = safetyModeAt(i);
    renderLocalReaction(opt, safety);
    if (item.id !== "seguranca" && !safety) requestAgentComment(item, picked);
  }
  $("q-title").focus({ preventScroll: true });

  $("next").onclick = () => {
    if (state.a[item.id] == null) return;
    if (state.a[item.id] === CUSTOM_ANSWER && !setCustomValidation(item, true)) {
      $("custom-answer").focus();
      return;
    }
    cancelCommentRequest();
    if (safetyModeAt(i)) return renderGate();
    state.i = i + 1;
    save();
    if (state.i >= Q.length) renderWrites();
    else renderQ();
  };
  $("back").onclick = () => {
    cancelCommentRequest();
    goBack(() => {
      if (i === 0) return renderHome({ replace: true });
      state.i = i - 1;
      save();
      renderQ({ replace: true });
    });
  };
}

function appendWriteField(box, write) {
  const lab = document.createElement("label");
  lab.setAttribute("for", "w-" + write.id);
  lab.textContent = write.q;
  const ta = document.createElement("textarea");
  ta.id = "w-" + write.id;
  ta.value = state.w[write.id] || "";
  ta.addEventListener("input", () => { state.w[write.id] = ta.value; save(); });
  box.append(lab, ta);
}

function appendSynthesisField(box, synthesis) {
  const lab = document.createElement("label");
  lab.setAttribute("for", "s-" + synthesis.id);
  lab.textContent = synthesis.q;
  const inp = document.createElement("input");
  inp.className = "line";
  inp.id = "s-" + synthesis.id;
  inp.value = state.syn[synthesis.id] || "";
  inp.addEventListener("input", () => { state.syn[synthesis.id] = inp.value; save(); });
  box.append(lab, inp);
}

function renderWrites(options = {}) {
  setChrome("step", "caderno");
  $("writes").innerHTML = `
    <div class="count">depois das opções</div>
    <div class="chap">A parte que o botão não cobre</div>
    <h1 class="q" id="writes-title" tabindex="-1" style="max-width:16ch">Escreve sem pensar demais.</h1>
    <p class="aside writes-intro">O caderno é opcional. Você pode ver o resultado agora ou responder só o que fizer sentido.</p>
    <button class="cta hot" id="toGate" type="button">Ver o resultado agora</button>
    <div class="open" id="openbox" style="margin-top:22px"></div>
    <details class="deep-dive" id="deepDive">
      <summary>Quero aprofundar</summary>
      <div class="open" id="extra-openbox"></div>
    </details>
    <button class="cta line" id="backQ" type="button">Voltar à última pergunta</button>
  `;
  const box = $("openbox");
  WRITES.slice(0, 3).forEach((write) => appendWriteField(box, write));
  const extra = $("extra-openbox");
  WRITES.slice(3).forEach((write) => appendWriteField(extra, write));
  const synTitle = document.createElement("div");
  synTitle.className = "chap";
  synTitle.style.marginTop = "28px";
  synTitle.textContent = "Síntese";
  extra.append(synTitle);
  SYN.forEach((synthesis) => appendSynthesisField(extra, synthesis));
  show("writes", "#screen=writes", options.replace === true);
  $("writes-title").focus({ preventScroll: true });
  $("toGate").onclick = renderGate;
  $("backQ").onclick = () => goBack(() => {
    state.i = Q.length - 1;
    save();
    renderQ({ replace: true });
  });
}

function collectCustomAnswers() {
  return collectCustomAnswersFromState(Q, state);
}

async function requestCustomAnalysis(answers, request) {
  const timeout = setTimeout(() => request.controller.abort(), JEV_TIMEOUT_MS);
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-sneub-session": commentSession()
      },
      body: JSON.stringify({ answers }),
      signal: request.controller.signal
    });
    if (!response.ok) throw new Error("analysis_failed");
    const analysis = validCustomAnalysis(await response.json(), answers);
    if (!analysis) throw new Error("invalid_analysis");
    return analysis;
  } finally {
    clearTimeout(timeout);
  }
}

function renderAnalysisLoading() {
  setChrome("step", "lendo");
  $("gate").innerHTML = `
    <div class="count">análise autorizada</div>
    <div class="loading-indicator" aria-hidden="true"></div>
    <h1 class="q" id="loading-title" tabindex="-1">Lendo o que você escreveu…</h1>
    <p class="aside">Só as respostas marcadas como “Outra resposta” foram enviadas. Se o serviço falhar, o resultado local aparece mesmo assim.</p>
    <p class="tiny" role="status" aria-live="polite">A análise leva no máximo alguns segundos.</p>
    <button class="cta line loading-skip" id="skipAnalysis" type="button">Continuar sem esperar</button>
  `;
  show("gate");
  $("loading-title").focus({ preventScroll: true });
  $("skipAnalysis").onclick = () => {
    if (analysisRequest) {
      analysisRequest.cancelled = true;
      analysisRequest.controller.abort();
    }
    renderOut(null, "Você continuou sem esperar. O resultado considera apenas as alternativas marcadas.", { canRetry: true });
  };
}

async function analyzeCustomAnswers() {
  if (safetyLocked()) {
    renderOut();
    return;
  }
  const answers = collectCustomAnswers();
  if (!answers.length) {
    renderOut();
    return;
  }
  const request = { controller: new AbortController(), cancelled: false };
  analysisRequest = request;
  renderAnalysisLoading();
  try {
    const analysis = await requestCustomAnalysis(answers, request);
    if (request.cancelled) return;
    renderOut(analysis);
  } catch (_) {
    if (request.cancelled) return;
    renderOut(
      null,
      "Não consegui interpretar as respostas escritas. Este resultado considera apenas as alternativas marcadas.",
      { canRetry: true }
    );
  } finally {
    if (analysisRequest === request) analysisRequest = null;
  }
}

function safetySupportActions() {
  return `
    <div class="safety-actions" aria-label="Apoio imediato">
      <a class="cta hot" href="tel:180">Ligar para o 180</a>
      <p>Central de Atendimento à Mulher: orientação sobre violência e serviços próximos.</p>
      <a class="cta line" href="tel:188">Ligar para o 188</a>
      <p>CVV: apoio emocional gratuito, 24 horas por dia.</p>
    </div>`;
}

function renderSafetyGate(options = {}) {
  setChrome("step", "segurança");
  $("gate").innerHTML = `
    <div class="chap"><span>Sem roast agora</span></div>
    <h1 class="q" id="gate-title" tabindex="-1">Sua segurança vem primeiro.</h1>
    <p class="lead">Você marcou medo, controle, coerção ou violência. Isso merece apoio real — e não uma piada.</p>
    <div class="safety-panel">
      <p>Se existe risco agora, saia deste site quando for seguro e procure uma pessoa de confiança. Use os contatos abaixo apenas se isso não aumentar o risco.</p>
      ${safetySupportActions()}
    </div>
    <button class="cta line discreet" id="safetyContinue" type="button">Continuar em modo discreto</button>
    <button class="cta text-action" id="safetyBack" type="button">Rever a resposta</button>
  `;
  show("gate", "#screen=gate", options.replace === true);
  $("gate").classList.add("grave");
  $("gate-title").focus({ preventScroll: true });
  $("safetyContinue").onclick = () => renderOut();
  $("safetyBack").onclick = () => goBack(() => renderQ({ replace: true }));
}

function renderGate(options = {}) {
  if (safetyLocked()) return renderSafetyGate(options);
  const customAnswers = collectCustomAnswers();
  const canAnalyze = customAnswers.length > 0;
  setChrome("step", "antes");
  $("gate").innerHTML = `
    <div class="count">antes do resultado</div>
    <h1 class="q" id="gate-title" tabindex="-1" style="max-width:16ch">Isto não é um diagnóstico.</h1>
    <p class="aside">Nenhuma porcentagem. Nenhum laudo. Só padrões que apareceram nas suas respostas, e uma frase para levar, se quiser.</p>
    <p class="aside" style="margin-top:18px">Se o que você descreveu envolve medo, ameaça, controle, isolamento, coerção ou violência, ignore o tom do site. Isso pode ser sério. <a href="tel:180">180</a> e <a href="tel:188">188</a> existem.</p>
    ${canAnalyze ? `
      <div class="consent">
        <p>Para interpretar o que você escreveu, o SNEUB precisa enviar essas respostas ao serviço de IA. As outras anotações continuam neste aparelho.</p>
        <button class="cta hot" id="analyze" type="button">Analisar minhas respostas escritas</button>
        <button class="cta line" id="without" type="button">Continuar sem enviar</button>
      </div>` : `
      <button class="cta hot" id="see" type="button" style="margin-top:auto">Ver meu resultado</button>`}
  `;
  show("gate", "#screen=gate", options.replace === true);
  $("gate-title").focus({ preventScroll: true });
  if (canAnalyze) {
    $("analyze").onclick = analyzeCustomAnswers;
    $("without").onclick = () => renderOut();
  } else {
    $("see").onclick = () => renderOut();
  }
}

function renderSafetyOut(options = {}) {
  setChrome("step", "segurança");
  $("out").innerHTML = `
    <h1 class="res" id="out-title" tabindex="-1">Antes de qualquer resultado.</h1>
    <p class="lead">O padrão que importa agora é segurança. O resto pode esperar.</p>
    <div class="safety-panel">
      <p>Você não precisa decidir tudo hoje. Se puder, avise alguém de confiança e combine uma forma segura de pedir ajuda.</p>
      ${safetySupportActions()}
    </div>
    <p class="tiny safety-note">Se não for seguro ligar, feche esta página e use um aparelho ao qual a outra pessoa não tenha acesso.</p>
    <button class="cta line" id="again" type="button">Rever respostas</button>
  `;
  show("out", "#screen=result", options.replace === true);
  $("out").classList.add("grave");
  $("out-title").focus({ preventScroll: true });
  $("again").onclick = () => { state.i = 0; save(); renderQ(); };
}

function renderOut(customAnalysis = null, analysisWarning = "", options = {}) {
  if (safetyLocked()) return renderSafetyOut(options);
  const rows = patterns(customAnalysis);
  const working = rows.filter((r) => r.good && r.heat < 0.35).sort((a, b) => b.good - a.good).slice(0, 3);
  const yellow = rows.filter((r) => r.heat >= 0.35 && r.heat < 0.85);
  const reds = rows.filter((r) => r.heat >= 0.85 || (r.k === "seguranca" && r.bad));
  const attention = [...reds, ...yellow].filter((v, i, arr) => arr.findIndex((x) => x.k === v.k) === i).slice(0, 4);
  const answered = Q.filter((q) => state.a[q.id] != null).length;
  const line = roastLine(rows, false);
  setChrome("step", "resultado");

  $("out").innerHTML = `
    <div class="count">${answered} perguntas respondidas</div>
    <h1 class="res" id="out-title" tabindex="-1">Então… temos coisas para conversar.</h1>
    ${analysisWarning ? `<div class="analysis-note" role="status"><p>${analysisWarning}</p>${options.canRetry ? `<button class="text-action" id="retryAnalysis" type="button">Tentar a análise novamente</button>` : ""}</div>` : ""}
    <p class="lead">Você respondeu ${answered} perguntas. O padrão que mais apareceu não foi falta de amor. Foi desgaste, ou a recusa em nomear o desgaste.</p>
    ${working.length ? `
      <div class="block">
        <div class="k">O que parece estar funcionando</div>
        ${working.map((r) => `<h3>${LABELS[r.k]}</h3><p>Você marcou, com alguma consistência, sinais de ${LABELS[r.k].toLowerCase()} que ainda estão de pé.</p>`).join("")}
      </div>` : ""}
    ${attention.length ? attention.map((r) => `
      <div class="block">
        <div class="k">${r.heat >= 0.85 || (r.k === "seguranca" && r.bad) ? "O que merece sua atenção" : "Onde acendeu uma luz amarela"}</div>
        <h3>${LABELS[r.k]}</h3>
        <p>${BLURB[r.k] || "Este tema voltou com uma cor menos confortável do que os outros."}</p>
      </div>`).join("") : `
      <div class="block">
        <div class="k">Leitura geral</div>
        <h3>Nada gritou</h3>
        <p>Isso não significa perfeição. Significa que, neste conjunto, não surgiu um padrão gritante de desgaste. A pergunta de três anos, abaixo, ainda vale.</p>
      </div>`}
    <div class="block">
      <div class="k">A pergunta que ficou</div>
      <h3 id="anos-label">Se nada nessa relação mudasse pelos próximos três anos, você ainda escolheria ficar?</h3>
      <label class="tiny" for="anos" style="display:block;margin:10px 0 6px">Escreva sem pensar demais. Só neste aparelho.</label>
      <textarea id="anos" aria-labelledby="anos-label"></textarea>
    </div>
    <div class="card">
      <div class="tm">Diagnóstico absolutamente não científico™</div>
      <p id="roastcard"></p>
    </div>
    <button class="cta" id="copy" type="button">Compartilhar meu roast</button>
    <p class="tiny">O card não leva suas respostas. Só a frase. O resto fica aqui.</p>
    <div class="warnbox">
      Antes de perguntar “será que essa pessoa me ama?”, pergunta: “eu me amo o suficiente para reconhecer se esta relação me faz bem?”<br><br>
      Medo, ameaça, controle, violência, coerção: procura gente de confiança e serviço especializado.
      <a href="tel:180">180</a> · <a href="tel:188">188</a>. Sua segurança vem primeiro.
    </div>
    <button class="cta line" id="again" type="button" style="margin-top:18px">Rever perguntas</button>
  `;
  $("roastcard").textContent = line;
  $("anos").value = state.anos || "";
  show("out", "#screen=result", options.replace === true);
  $("out-title").focus({ preventScroll: true });
  $("anos").oninput = (e) => { state.anos = e.target.value; save(); };
  $("copy").onclick = async () => {
    const txt = "SEU NAMORO É UMA BOSTA?\n\nDiagnóstico absolutamente não científico™\n“" + line + "”\n\nsneub";
    try {
      await navigator.clipboard.writeText(txt);
      $("copy").textContent = "Copiado. Cola onde quiser.";
    } catch {
      const range = document.createRange();
      range.selectNodeContents($("roastcard"));
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      $("copy").textContent = "Texto selecionado. Copia aí.";
    }
  };
  if ($("retryAnalysis")) $("retryAnalysis").onclick = analyzeCustomAnswers;
  $("again").onclick = () => { state.i = 0; save(); renderQ(); };
}

$("wipe").onclick = () => {
  if (confirm("Apagar tudo o que você respondeu neste aparelho?")) {
    try { localStorage.removeItem(KEY); } catch (_) {}
    cancelCommentRequest();
    if (analysisRequest) {
      analysisRequest.cancelled = true;
      analysisRequest.controller.abort();
    }
    Object.keys(state).forEach((key) => delete state[key]);
    Object.assign(state, createEmptyState());
    window.history.replaceState({ sneub: true, internal: false }, "", "#screen=home");
    renderHome({ replace: true });
  }
};

function renderFromLocation(initial = false) {
  renderingHistory = true;
  let canonicalHash = window.location.hash || "#screen=home";
  try {
    const hash = canonicalHash;
    if (hash.startsWith("#question=")) {
      let id = "";
      try { id = decodeURIComponent(hash.slice("#question=".length)); } catch (_) {}
      const index = Q.findIndex((question) => question.id === id);
      if (index >= 0) {
        state.i = index;
        save();
        renderQ();
      } else {
        renderHome();
        canonicalHash = "#screen=home";
      }
    } else if (hash === "#screen=writes" || hash === "#writes") {
      renderWrites();
      canonicalHash = "#screen=writes";
    } else if (hash === "#screen=gate" || hash === "#gate") {
      renderGate();
      canonicalHash = "#screen=gate";
    } else if (hash === "#screen=result" || hash === "#result") {
      renderOut();
      canonicalHash = "#screen=result";
    } else {
      renderHome();
      canonicalHash = "#screen=home";
    }
  } finally {
    renderingHistory = false;
  }
  if (initial || window.location.hash !== canonicalHash) {
    window.history.replaceState(
      { sneub: true, internal: initial ? false : Boolean(window.history.state && window.history.state.internal) },
      "",
      canonicalHash
    );
  }
}

window.addEventListener("popstate", () => renderFromLocation());
renderFromLocation(true);
