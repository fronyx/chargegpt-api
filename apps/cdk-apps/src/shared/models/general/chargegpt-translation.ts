export const ChargegptMissingHelpError = {
  EN: 'Sorry, something unexpected happened in processing your request. Can you try rephrasing your request?',
  DE: 'Entschuldigung, etwas Unerwartetes ist bei der Bearbeitung Deiner Anfrage passiert. Können Sie versuchen, Ihre Anfrage anders zu formulieren?',
  ES: 'Lo sentimos, currió algo inesperado al procesar tu solicitud.. ¿Puedes intentar reformular tu solicitud?',
  FR: 'Désolé, quelque chose d\'inattendu s\'est produit lors du traitement de votre demande. Pouvez-vous essayer de reformuler votre demande?',
  PT: 'Desculpe, algo inesperado aconteceu ao processar o seu pedido. Tente reformular o seu pedido.',
  CZ: 'Omlouváme se, při zpracování vaší žádosti došlo k neočekávané události. Můžete zkusit svůj požadavek přeformulovat?',
};

export const ChargegptInternalServerError = {
  EN: 'We are sorry, ChargeGPT is not available at the moment. Please try again later.',
  DE: 'Es tut uns leid, ChargeGPT ist im Moment nicht verfügbar. Bitte versuche es später noch einmal.',
  ES: 'Lamentamos, ChargeGPT no está disponible en este momento. Por favor, inténtalo de nuevo más tarde.',
  FR: 'Nous sommes désolés, ChargeGPT n\'est pas disponible pour le moment. Veuillez réessayer plus tard.',
  PT: 'Lamentamos, o ChargeGPT não está disponível neste momento. Por favor, tente novamente mais tarde.',
  CZ: 'Omlouváme se, ale služba ChargeGPT není v tuto chvíli k dispozici. Zkuste to prosím později.',
};

export const StartRecommendationConversation = {
  EN: 'Where and when do you want to charge?',
  DE: 'Wo und wann möchtest Du laden?',
  ES: '¿Dónde y cuándo quieres cargar?',
  FR: 'Où et quand veux-tu charger?',
  PT: 'Onde e quando queres carregar?',
  CZ: 'Kde a kdy chcete nabíjet?',
};

export const StartFilterConversation = {
  EN: 'Where and how do you want to charge?',
  DE: 'Wo und wie möchtest du aufladen?',
  ES: '¿Dónde y cómo quieres cargar?',
  FR: 'Où et comment veux-tu charger?',
  PT: 'Onde e como gostaria de carregar?',
  CZ: 'Kde a jak chcete nabíjet?',
};

export const MostAvailableLocation = {
  EN: 'Most available',
  DE: 'Am Verfügbarsten',
  ES: 'Más disponible',
  FR: 'Le plus disponible',
  PT: 'O mais disponível',
  CZ: 'Nejdostupnější',
};

export const NearestLocation = {
  EN: 'Nearest',
  DE: 'Am Nächsten',
  ES: 'Más cercano',
  FR: 'Le plus proche',
  PT: 'O mais próximo',
  CZ: 'Nejbližší',
};

export const FastestLocation = {
  EN: 'Fastest',
  DE: 'Am Schnellsten',
  ES: 'Más rápido',
  FR: 'Le plus rapide',
  PT: 'O mais rápido',
  CZ: 'Nejrychlejší',
};

export const FasterOptionLocation = {
  EN: 'Faster option',
  DE: 'Schnellere Option',
  ES: 'Opción más rápida',
  FR: 'Option plus rapide',
  PT: 'Opção mais rápida',
  CZ: 'Rychlejší možnost',
};

export const SlowerOptionlocation = {
  EN: 'Slower option',
  DE: 'Langsamere Option',
  ES: 'Opción más lenta',
  FR: 'Option la plus lente',
  PT: 'Opção mais lenta',
  CZ: 'Pomalejší možnost',
};

export const LocationRequestMessage = {
  EN: 'Please provide access to your current location.',
  DE: 'Darf ich auf deinen aktuellen Standort zugreifen?',
  ES: 'Por favor, proporciona acceso a tu ubicación actual.',
  FR: 'Veuillez fournir l\'accès à votre emplacement actuel.',
  PT: 'Por favor, forneça acesso à sua localização atual.',
  CZ: 'Uveďte prosím přístup ke své aktuální poloze.',
};

export const LocationDeniedResponse = {
  EN: 'Ok! Can you give me an address or name a place of interest?',
  DE: 'Ok! Kannst du mir eine Adresse oder Interessenspunkt nennen?',
  ES: '¡Ok! ¿Puedes darme una dirección o mencionar un lugar de interés?',
  FR: 'D\'accord ! Pouvez-vous me donner une adresse ou nommer un lieu d\'intérêt?',
  PT: 'Certo! Pode fornecer-me um endereço ou mencionar um local de interesse?',
  CZ: 'Ok! Můžete mi dát adresu nebo jméno místa, které vás zajímá?',
};

export const ReachConversationTurnLimitError = {
  EN: 'I\'m sorry. For now I’m trained to hold shorter interactions. Could you repeat, please?',
  DE: 'Es tut mir leid. Im Moment bin ich darauf trainiert, kürzere Interaktionen zu führen. Kannst Du das bitte wiederholen?',
  ES: 'Lo siento. Por ahora, estoy entrenado para mantener interacciones más cortas. ¿Podría repetirlo, por favor?',
  FR: 'Je suis désolé. Pour l\'instant, je suis entraîné à tenir des interactions plus courtes. Pourriez-vous répéter, s\'il vous plaît?',
  PT: 'Lamento. Neste momento, estou treinado para ter interações mais curtas. Pode repetir, por',
  CZ: 'Omlouvám se. Prozatím jsem vyškolen na kratší interakce. Můžete to prosím zopakovat?',
};

export const ChargeGPTIntroduction = {
  EN: 'Where and when do you want to charge?',
  DE: 'Wo und wann möchtest Du laden?',
  ES: '¿Dónde y cuándo quieres cargar?',
  FR: 'Où et quand veux-tu charger?',
  PT: 'Onde e quando queres carregar?',
  CZ: 'Kde a kdy chcete nabíjet?',
};

export const ChargegptSummary = {
  EN: '1. I can generate recommendations for charging requests for a destination (specific locations, address, country, area, city center or cardinal direction), a given arrival time (absolute or relative), charging speed (from 0kW up to 500kW), charging duration, power type (AC or DC), plug type / connector type (CCS, combo connector, Chademo or Type-2) and charge point operator names (many many specific, including charger brands).\n' +
    '2. I will evaluate the distance to destination, predicted availability at arrival time and available charging speeds in its recommendation.\n' +
    '3. You can also refine your requests after getting a first recommendation.\n' +
    '4. I can identify not just an address but also the user\'s current location, points of interest, such as McDonald\'s or categories of POI, such as a park, toilet, museum, fast-food restaurant, as a destination.\n' +
    '5. Of course, you can always reset the conversation and the above mentioned charging needs.\n',
  DE: '1. Ich kann Empfehlungen für Ladewünsche für ein Ziel, eine gegebene Ankunftszeit, Ladeleistungsbedarf und Betreibernamen generieren.\n' +
    '2. Ich bewerte die Entfernung zum Ziel, die vorhergesagte Verfügbarkeit bei der Ankunftszeit und die verfügbaren Ladeleistungen in meiner Empfehlung.\n' +
    '3. Du kannst Deine Anfragen auch nach Erhalt einer ersten Empfehlung verfeinern.\n' +
    '4. Ich kann nicht nur eine Adresse, sondern auch “Point-of-Interests” wie McDonald\'s oder einen Park als Zielort nutzen. \n\n' +
    'Wo und wann möchtest Du laden?',
  ES: '1. Puedo generar recomendaciones para solicitudes de carga para un destino, una hora de llegada específica, una necesidad de velocidad de carga y nombres de operadores.\n' +
    '2. Evaluaré la distancia al destino, la disponibilidad prevista en el momento de la llegada y las velocidades de carga disponibles en su recomendación.\n' +
    '3. También puedes refinar tus solicitudes después de obtener una primera recomendación.\n' +
    '4. Puedo identificar no solo una dirección, sino también puntos de interés, como McDonald\'s o un parque, como destino.\n\n' +
    '¿Dónde y cuándo quieres cargar?',
  FR: '1. Je peux générer des recommandations pour des demandes de charge pour une destination, une heure d\'arrivée donnée, un besoin de vitesse de charge et des noms d\'opérateurs.\n' +
    '2. J\'évaluerai la distance jusqu\'à la destination, la disponibilité prévue à l\'heure d\'arrivée et les vitesses de charge disponibles dans sa recommandation.\n' +
    '3. Vous pouvez également affiner vos demandes après avoir obtenu une première recommandation.\n' +
    '4. Je peux identifier non seulement une adresse, mais aussi des points d\'intérêt, tels que McDonald\'s ou un parc, comme destination.\n\n' +
    'Où et quand veux-tu recharger?',
  PT: '1. Posso gerar recomendações para solicitações de carregamento para um destino, uma hora de chegada específica, necessidade de velocidade de carregamento e nomes de operadores.\n' +
    '2. Avaliarei a distância até o destino, a disponibilidade prevista na hora da chegada e as velocidades de carregamento disponíveis em sua recomendação.\n' +
    '3. Pode também aperfeiçoar os seus pedidos após receber uma primeira recomendação.\n' +
    '4. Posso identificar não apenas um endereço, mas também postos de interesse, como o McDonald\'s ou um parque, como destino.\n\n' +
    'Onde e quando queres carregar?',
};

export const ChargegptFilterSummary = {
  EN: '1. I can set up filters for finding charging stations.\n' +
    '2. I can find charge points nearby or at a location like an address or a point-of-interest (POI).\n' +
    '3. I can set filters for charge points according to your charging needs, following the filter structure of neutral-payment-provider.\n' +
    '4. I cannot answer questions about charge points, charge point operators or neutral-payment-provider.' +
    '5. I cannot compare charging prices.' +
    '6. I cannot help with problems with the app or charge points.' +
    '8. I cannot filter for specific plug types (like CCS, Type 2, Chademo and so on). I can however show you charge points compatible with your car.' +
    'Where and how do you want to charge?',
  DE: '1. Ich kann Filter einrichten, um Ladestationen zu finden.\n' +
    '2. Ich kann Ladepunkte an einem Ort wie einer Adresse oder einem Point-of-Interest (POI) finden.\n' +
    '3. Ich kann Filter für Ladepunkte entsprechend Deinen Ladebedürfnissen einstellen, gemäß der Filterstruktur von neutral-payment-provider.\n' +
    '4. Ich kann keine Fragen zu Ladepunkten, Betreibern von Ladepunkten oder neutral-payment-provider beantworten.' +
    '5. Ich kann Ladepreise nicht vergleichen.' +
    '6. Ich kann nicht bei Problemen mit der App oder Ladepunkten helfen.' +
    '7. Ich kann keine Route mit Ladestopps planen.' +
    '8. Ich kann nicht nach bestimmten Steckertypen, wie CCS oder Type 2, filtern.' +
    'Wo und wie möchtest Du laden?',
  ES: '1. Puedo configurar filtros para encontrar estaciones de carga.\n' +
    '2. Puedo encontrar puntos de carga en una ubicación como una dirección o un punto de interés (POI).\n' +
    '3. Puedo configurar filtros para puntos de carga de acuerdo con sus necesidades de carga, siguiendo la estructura de filtros de neutral-payment-provider.\n' +
    '4. No puedo responder preguntas sobre puntos de carga, operadores de puntos de carga o neutral-payment-provider.' +
    '5. No puedo comparar precios de carga.' +
    '6. No puedo ayudar con problemas con la aplicación o puntos de carga.' +
    '7. No puedo planificar una ruta con paradas de carga.' +
    '8. No puedo filtrar tipos de enchufes específicos como CCS o Tipo 2.' +
    '¿Dónde y cómo quieres cargar?',
  FR: '1. Je peux configurer des filtres pour trouver des stations de charge.\n' +
    '2. Je peux trouver des points de charge dans un lieu tel qu\'une adresse ou un point d\'intérêt (POI).\n' +
    '3. Je peux configurer des filtres pour les points de charge selon vos besoins de charge, en suivant la structure de filtre de neutral-payment-provider.\n' +
    '4. Je ne peux pas répondre aux questions concernant les points de charge, les opérateurs de points de charge ou neutral-payment-provider.' +
    '5. Je ne peux pas comparer les prix de charge.' +
    '6. Je ne peux pas aider avec les problèmes liés à l\'application ou aux points de charge.' +
    '7. Je ne peux pas planifier un itinéraire avec des arrêts de charge.' +
    '8. Je ne peux pas filtrer des types de connecteurs spécifiques, tels que CCS ou Type 2.' +
    'Où et comment veux-tu charger?',
  PT: '1. Posso configurar filtros para encontrar estações de carregamento.\n' +
    '2. Posso encontrar postos de carregamento num local como um endereço ou um ponto de interesse (POI).\n' +
    '3. Posso configurar filtros para postos de carregamento de acordo com as suas necessidades de carregamento, seguindo a estrutura de filtros da neutral-payment-provider.\n' +
    '4. Não posso responder a perguntas sobre postos de carregamento, operadores de postos de carregamento ou sobre a neutral-payment-provider.' +
    '5. Não posso comparar preços de carregamento.' +
    '6. Não posso ajudar com problemas com a aplicação ou postos de carregamento.' +
    '7. Não posso planear uma rota com paragens para carregamento.' +
    '8. Não consigo filtrar tipos de conectores específicos, como CCS ou Tipo 2.' +
    'Onde e como gostaria de carregar?',
};

export const NoInputError = {
  EN: 'Sorry, can you repeat that?',
  DE: 'Entschuldige, kannst du das bitte wiederholen?',
  ES: 'Lo siento, ¿puedes repetir eso?',
  FR: 'Désolé, peux-tu répéter cela?',
  PT: 'Desculpe, pode repetir isso?',
  CZ: 'Promiňte, můžete to zopakovat?',
};

export const AddressTimeTips = {
  EN: 'You could however try again at a different place and time.',
  DE: 'Du könntest es an einem anderen Ort oder zu einer anderen Zeit versuchen.',
  ES: 'Sin embargo, podrías intentarlo de nuevo en un lugar y momento diferente.',
  FR: 'Cependant, tu pourrais essayer à nouveau à un endroit et à un moment différents.',
  PT: 'No entanto, poderia tentar novamente num local e momento diferentes.',
  CZ: 'Můžete to však zkusit znovu na jiném místě a v jiném čase.',
};

export const ChargingSpeedTips = {
  EN: 'You could however try again with any charging speed.',
  DE: 'Du könntest es mit einer anderen Ladegeschwindigkeit versuchen.',
  ES: 'Sin embargo, podrías intentarlo nuevamente con cualquier velocidad de carga.',
  FR: 'Cependant, tu pourrais essayer à nouveau avec n\'importe quelle vitesse de charge.',
  PT: 'No entanto, pode tentar novamente com qualquer velocidade de carregamento.',
  CZ: 'Mohli byste to však zkusit znovu s jakoukoli rychlostí nabíjení.',
};

export const OperatorNameTips = {
  EN: 'You could however try again searching for all charge point operators.',
  DE: 'Du könntest versuchen alle Ladestationsbetreiber zu durchsuchen.',
  ES: 'No obstante, podrías intentar nuevamente buscando todos los operadores de puntos de carga.',
  FR: 'Cependant, vous pourriez essayer à nouveau en recherchant tous les opérateurs de points de charge.',
  PT: 'No entanto, pode tentar novamente procurando por todos os operadores de postos de carregamento.',
  CZ: 'Můžete to však zkusit znovu vyhledáním všech provozovatelů nabíjecích stanic.',
};

export const FilterResponseWithOnlyNearbyLocation = {
  EN: 'Nearby, you can find the following charge points:',
  DE: 'In der Nähe finden Sie folgende Ladepunkte:',
  ES: 'Cerca, puedes encontrar los siguientes puntos de carga:',
  FR: 'À proximité, vous pouvez trouver les points de charge suivants :',
  PT: 'Perto, pode encontrar o seguintes postos de carregamento que correspondem ao seu pedido:',
  CZ: 'V blízkosti můžete najít následující nabíjecí místa:',
};

export const FilterResultMatchingRequest = {
  EN: 'The following charge points match your request:',
  DE: 'Die folgenden Ladepunkte entsprechen Ihrer Anfrage:',
  ES: 'Los siguientes puntos de carga coinciden con tu solicitud:',
  FR: 'Les points de charge suivants correspondent à votre demande :',
  PT: 'Os seguintes postos de carregamento correspondem ao seu pedido:',
  CZ: 'Vaší žádosti odpovídají následující místa pro nabíjení:',
};

export const FilterResponseWithNearbyLocationAndFilter = {
  EN: 'Nearby, you can find the following charge points that match your request:',
  DE: 'In der Nähe finden Sie folgende Ladepunkte, die Ihrer Anfrage entsprechen:',
  ES: 'Cerca, puedes encontrar los siguientes puntos de carga que coinciden con tu solicitud:',
  FR: 'À proximité, vous pouvez trouver les points de charge suivants qui correspondent à votre demande :',
  PT: 'Nas proximidades, você pode encontrar os seguintes postos de carga que correspondem à sua solicitação:',
  CZ: 'V blízkosti naleznete následující místa pro nabíjení, která odpovídají vaší žádosti:',
};

export const ContentFilterError = {
  EN: 'Sorry, something in your request has triggered a safety mechanism. Can you try rephrasing your request?',
  DE: 'Entschuldigung, etwas in Ihrer Anfrage hat einen Sicherheitsmechanismus ausgelöst. Können Sie versuchen, Ihre Anfrage anders zu formulieren?',
  ES: 'Lo sentimos, algo en tu solicitud ha activado un mecanismo de seguridad. ¿Puedes intentar reformular tu solicitud?',
  FR: 'Désolé, quelque chose dans votre demande a déclenché un mécanisme de sécurité. Pouvez-vous essayer de reformuler votre demande?',
  PT: 'Desculpe, algo no seu pedido acionou um mecanismo de segurança. Tente reformular o seu pedido.',
  CZ: 'Omlouváme se, něco ve vašem požadavku spustilo bezpečnostní mechanismus. Můžete zkusit svůj požadavek přeformulovat?',
}

export const ChargegptFilterDefaultText = {
  EN: 'I\'ve updated the map based on your request.', 
  DE: 'Ich habe die Karte gemäß Ihrer Anfrage aktualisiert.',
  ES: 'He actualizado el mapa según su solicitud.',
  FR: 'J\'ai mis à jour la carte en fonction de votre demande.',
  PT: 'Atualizei o mapa com base no seu pedido.',
  CZ: 'Na základě vaší žádosti jsem mapu aktualizoval.',
}

export const RestartConversationText = {
  EN: 'Sure, let\'s restart!',
  DE: 'Na klar, lass uns neu anfangen!',
  ES: '¡Claro, reiniciemos!',
  FR: 'D\'accord! Depuis le début!',
  PT: 'Com certeza, vamos recomeçar!',
  CZ: 'Jistě, restartujeme!',
}
