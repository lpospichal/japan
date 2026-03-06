export const SEED_TRIP = {
  meta: {
    title: 'Japan Family Companion',
    subtitle: 'Shared planner for March 18 to April 4, 2026',
    travelers: ['Lucie', 'Maty', 'Family Member 3'],
    startDate: '2026-03-18',
    endDate: '2026-04-04',
    themeColor: '#b54866'
  },
  stays: [
    {
      id: 'stay-tokyo-1',
      city: 'Tokyo',
      dates: 'Mar 18 to Mar 22',
      title: 'Skyterrace Love Asakusa Downtown',
      address: 'Sky Terrace Asakusa, 3-14-14 Kotobuki, Taito-ku, Tokyo',
      area: 'Asakusa',
      note: 'Self check-in apartment close to Asakusa Station and Kuramae Jinja Shrine.',
      ops: ['Complete pre check-in before arrival day', 'After 11:30 on check-in day open the check-in link again for room details', 'Extra towels and cleaning are paid add-ons'],
      links: ['https://maps.app.goo.gl/KusRLHowpamoFoRm8'],
      sensitive: 'Onestay self check-in link and room/password details are hidden until needed.'
    },
    {
      id: 'stay-matsumoto',
      city: 'Matsumoto',
      dates: 'Mar 22 to Mar 24',
      title: 'CLA-CHIC traditional house',
      address: '1-4-5 Jōnishi, Matsumoto City, Nagano 390-0875',
      area: 'Jōnishi',
      note: 'Whole traditional house stay with thoughtful amenities and board games.',
      ops: ['Let the host know estimated arrival time by the day before', 'Check-in starts at 15:00', 'Checkout deadline 10:00'],
      links: ['https://maps.app.goo.gl/HYXVHkJyDgyNyQ8Q6']
    },
    {
      id: 'stay-takayama',
      city: 'Takayama',
      dates: 'Mar 24 to Mar 25',
      title: 'Residence Hotel Takayama Station',
      address: '6-105 Hanasatomachi, Takayama, Gifu',
      area: 'Takayama Station',
      note: 'Right by the station with kitchen and laundry in room.',
      ops: ['Check-in 15:00 to 24:00', 'Early check-in request was declined', 'Non-smoking rooms only'],
      links: []
    },
    {
      id: 'stay-kanazawa',
      city: 'Kanazawa',
      dates: 'Mar 25 to Mar 28',
      title: 'Minn Kanazawa',
      address: '2-28 Kamitsutsumicho, Kanazawa, Ishikawa 920-0869',
      area: 'Central Kanazawa',
      note: 'Tablet assisted check-in with QR flow and midnight entrance PIN.',
      ops: ['Complete Suitebook pre check-in before arrival', 'Scan reception tablet QR on arrival', 'Entrance is locked from midnight to 5 am'],
      links: ['https://staytuned.asia/brands/minn/hotels/minn-kanazawa/house-guide', 'https://form.run/@guest-inquiry-after-reservation'],
      sensitive: 'Midnight entrance PIN and key code remain hidden until reveal.'
    },
    {
      id: 'stay-kyoto',
      city: 'Kyoto',
      dates: 'Mar 28 to Apr 1',
      title: 'The Royal Park Hotel Kyoto Umekoji',
      address: 'Umekōji-Kyōtonishi station area, Kyoto',
      area: 'Umekoji',
      note: 'Very practical ops base with station outside, FamilyMart attached, and an onsen.',
      ops: ['Standard check-in 15:00', 'Luggage storage available on arrival day', 'Station can be crowded during rush hours'],
      links: []
    },
    {
      id: 'stay-tokyo-2',
      city: 'Tokyo',
      dates: 'Apr 1 to Apr 4',
      title: 'MKG HOTEL 浅草',
      address: 'Asakusa, Tokyo',
      area: 'Asakusa',
      note: 'Final Tokyo base for cherry blossoms and shopping.',
      ops: ['Reservation number saved', 'Check-in Apr 1', 'Checkout Apr 4 before flight'],
      links: []
    }
  ],
  bookings: [
    {
      id: 'booking-flight-out',
      kind: 'Flight',
      title: 'JFK to HND',
      date: '2026-03-18',
      time: '01:50',
      location: 'JFK Airport',
      code: 'Saved in source materials',
      details: 'Overnight flight to Tokyo Haneda.',
      reveal: 'Flight confirmation should be added later from exported email or ticket file.'
    },
    {
      id: 'booking-flight-return',
      kind: 'Flight',
      title: 'HND to JFK',
      date: '2026-04-04',
      time: '10:50',
      location: 'Tokyo Haneda Airport',
      code: 'Saved in source materials',
      details: 'Leave hotel about 06:30 for the airport.',
      reveal: 'Return confirmation should be added later from email export.'
    },
    {
      id: 'booking-kanazawa-checkin',
      kind: 'Stay',
      title: 'Minn Kanazawa pre check-in',
      date: '2026-03-25',
      time: 'Before arrival',
      location: 'Minn Kanazawa',
      code: 'Reference 5025',
      details: 'Complete the pre check-in flow before arrival, then scan the reception tablet QR.',
      reveal: 'Suitebook pre check-in link and midnight entrance PIN are in the source material.'
    },
    {
      id: 'booking-tokyo-self-checkin',
      kind: 'Stay',
      title: 'Asakusa apartment self check-in',
      date: '2026-03-19',
      time: 'After 11:30',
      location: 'Sky Terrace Asakusa',
      code: 'Check-in code saved in source materials',
      details: 'Open the self check-in link again after 11:30 on the day of arrival to get room number and password.',
      reveal: 'Sensitive link hidden until tapped.'
    },
    {
      id: 'booking-teamlab',
      kind: 'Experience',
      title: 'teamLab slot placeholder',
      date: '2026-03-21',
      time: 'Check source files',
      location: 'Tokyo',
      code: 'To confirm',
      details: 'Use this placeholder until the ticket email is added through the update flow.',
      reveal: 'Ticket import ready.'
    }
  ],
  travelLegs: [
    {
      id: 'leg-hnd-asakusa',
      date: '2026-03-19',
      title: 'Haneda arrival to Asakusa base',
      from: 'Tokyo Haneda Airport',
      to: 'Asakusa apartment',
      duration: 'Arrival morning',
      bookingSource: 'Flight + local transit',
      steps: ['Land at 05:25', 'Go to apartment and drop bags if possible', 'Start calm traditional Tokyo first'],
      backup: 'If very tired, keep the day centered around Asakusa only.',
      note: 'Arrival day is intentionally gentle.'
    },
    {
      id: 'leg-tokyo-matsumoto',
      date: '2026-03-22',
      title: 'Tokyo to Matsumoto',
      from: 'Shinjuku',
      to: 'Matsumoto',
      duration: '~2.5h',
      bookingSource: 'JR East',
      steps: ['Travel from Shinjuku to Matsumoto', 'Check in at CLA-CHIC after 15:00', 'Castle and merchant quarter if energy is good'],
      backup: 'If arrival runs late, focus on Nakamachi and an early dinner.',
      note: 'Ticket pickup details live in Tokyo station ticket docs.'
    },
    {
      id: 'leg-matsumoto-takayama',
      date: '2026-03-24',
      title: 'Matsumoto to Takayama',
      from: 'Matsumoto',
      to: 'Takayama',
      duration: '~2.5 to 3h',
      bookingSource: 'Bus or rail planning notes',
      steps: ['Prefer scenic left side if on the bus', 'Aim to simplify arrival and old-town stroll', 'Residence Hotel check-in from 15:00'],
      backup: 'Skip side trips if the family is tired and save energy for evening Takayama.',
      note: 'Bus seat note is one of the strongest operational tips in the archive.'
    },
    {
      id: 'leg-takayama-kanazawa',
      date: '2026-03-25',
      title: 'Takayama to Kanazawa',
      from: 'Takayama',
      to: 'Kanazawa',
      duration: '~2h15',
      bookingSource: 'Bus planning docs',
      steps: ['Morning Takayama sightseeing first', 'Bus in the afternoon', 'Evening arrival and easy dinner'],
      backup: 'Use station sushi or nearby simple dinner on arrival if everyone is low energy.',
      note: 'Kanazawa stay has an important QR based check-in flow.'
    },
    {
      id: 'leg-kanazawa-kyoto',
      date: '2026-03-28',
      title: 'Kanazawa to Kyoto via Tsuruga',
      from: 'Kanazawa',
      to: 'Kyoto',
      duration: '~2.5h',
      bookingSource: 'JR West / shinkansen notes',
      steps: ['09:05 Kanazawa to 10:02 Tsuruga', '10:14 Tsuruga to 11:10 Kyoto', 'Go one stop to Umekōji Kyōtonishi or walk, then drop luggage'],
      backup: 'If transfer feels stressful, simplify arrival afternoon and preserve evening illumination only if energy is good.',
      note: 'Kyoto arrival day is packed, so the Today screen should offer a late start version.'
    },
    {
      id: 'leg-kyoto-tokyo',
      date: '2026-04-01',
      title: 'Kyoto to Tokyo',
      from: 'Kyoto',
      to: 'Tokyo',
      duration: '~2h15 on train plus hotel transit',
      bookingSource: 'Shinkansen planning docs',
      steps: ['Do Southern Higashiyama at dawn', 'Return to hotel by 14:00 for luggage', 'Train about 15:00', 'Settle back into Tokyo'],
      backup: 'Skip Sanjūsangen dō if the morning is running long.',
      note: 'This is a compressed half sightseeing / half transfer day.'
    },
    {
      id: 'leg-hotel-hnd',
      date: '2026-04-04',
      title: 'Final departure to Haneda',
      from: 'MKG HOTEL Asakusa',
      to: 'Haneda Airport',
      duration: 'Early morning airport run',
      bookingSource: 'Flight plan',
      steps: ['Leave about 06:30', 'Keep airport process easy and conservative', 'Use the previous evening to prepare and pack fully'],
      backup: 'Make the last Tokyo evening light and organized.',
      note: 'This should surface as a high priority reminder on Apr 3.'
    }
  ],
  days: [
    {
      id: 'day-2026-03-19',
      date: '2026-03-19',
      city: 'Tokyo',
      title: 'Arrival day and traditional east Tokyo',
      hotelId: 'stay-tokyo-1',
      focus: 'Calm arrival rhythm with Asakusa, guide meeting, and only light expansion if energy allows.',
      leaveBy: 'Flexible after arrival',
      fixed: ['Land at Haneda 05:25', 'Tour with Yasuji starting at 10:00 at the apartment', 'Asakusa and Senso-ji before crowds'],
      optional: ['Yanaka', 'Nezu Shrine', 'Ueno', 'Sumida Park', 'Akihabara only if energy is surprisingly good'],
      food: ['Asakusa local breakfast or convenience store reset', 'Keep lunch easy and nearby'],
      backup: 'If jet lag hits hard, keep the whole day around Asakusa and save the rest.',
      blossom: 'Low blossom pressure today. Prioritize ease over ambition.'
    },
    {
      id: 'day-2026-03-20',
      date: '2026-03-20',
      city: 'Tokyo',
      title: 'Shibuya and Harajuku holiday crowds day',
      hotelId: 'stay-tokyo-1',
      focus: 'See the big names but stay realistic because of the holiday and jet lag.',
      leaveBy: 'Morning start',
      fixed: ['Shibuya', 'Harajuku', 'Takeshita Street'],
      optional: ['Meiji Jingu', 'Short Shinjuku look only if the family still has energy'],
      food: ['Keep lunch flexible near Shibuya', 'Plan a simple dinner if the day gets crowded'],
      backup: 'If crowds are too much, cut back to one neighborhood and preserve energy.',
      blossom: 'No special blossom timing needed yet.'
    },
    {
      id: 'day-2026-03-21',
      date: '2026-03-21',
      city: 'Tokyo',
      title: 'teamLab and central Tokyo cluster',
      hotelId: 'stay-tokyo-1',
      focus: 'Mix one major immersive stop with a polished city cluster and keep the evening flexible.',
      leaveBy: 'Timed around teamLab slot',
      fixed: ['teamLab', 'Ginza or central Tokyo cluster', 'Shinjuku if possible because it is a priority'],
      optional: ['Tsukiji', 'Hamarikyu Gardens', 'Akihabara if central Tokyo finishes early'],
      food: ['Ginza lunch', 'Quick Kyoto style decision making for evening based on energy'],
      backup: 'If the immersive stop runs long, simplify the rest to Ginza plus one evening neighborhood.',
      blossom: 'Save moat photography for the April return if needed.'
    },
    {
      id: 'day-2026-03-22',
      date: '2026-03-22',
      city: 'Matsumoto',
      title: 'Transfer to Matsumoto and castle town arrival',
      hotelId: 'stay-matsumoto',
      focus: 'Transition cleanly into a smaller, calmer city.',
      leaveBy: 'Travel day',
      fixed: ['Train Shinjuku to Matsumoto', 'Check in after 15:00', 'Matsumoto Castle area', 'Nakamachi merchant quarter'],
      optional: ['Nawate Street', 'Small shrine wandering'],
      food: ['Local soba', 'Easy old-town dinner'],
      backup: 'If arrival is later than planned, do one short old-town walk and reset.',
      blossom: 'Urban atmosphere day, not blossom dependent.'
    },
    {
      id: 'day-2026-03-23',
      date: '2026-03-23',
      city: 'Matsumoto / Narai-juku',
      title: 'Narai-juku day trip',
      hotelId: 'stay-matsumoto',
      focus: 'Historic street atmosphere with a slower pace.',
      leaveBy: 'Morning start',
      fixed: ['Narai-juku', 'Museum', 'Return to Matsumoto'],
      optional: ['Extra Matsumoto streets and shrines', 'Miso brewery if desired'],
      food: ['Soba and old-post-town snacks'],
      backup: 'If weather turns, shorten Narai and keep a calmer Matsumoto afternoon.',
      blossom: 'Not the main sakura day. Prioritize town atmosphere.'
    },
    {
      id: 'day-2026-03-24',
      date: '2026-03-24',
      city: 'Takayama',
      title: 'Matsumoto to Takayama with alpine scenery',
      hotelId: 'stay-takayama',
      focus: 'Scenic transit and a first taste of Takayama old-town rhythm.',
      leaveBy: 'Travel day',
      fixed: ['Travel to Takayama', 'Check in at Residence Hotel Takayama Station', 'Takayama old town or simple evening walk'],
      optional: ['Furukawa', 'Hida Folk Village only if timing stays clean'],
      food: ['Hida beef or easy station-area dinner'],
      backup: 'If transit feels like enough, do just one atmospheric walk and sleep early.',
      blossom: 'Scenery and town character matter more than blossoms here.'
    },
    {
      id: 'day-2026-03-25',
      date: '2026-03-25',
      city: 'Takayama to Kanazawa',
      title: 'Takayama morning then Kanazawa transfer',
      hotelId: 'stay-kanazawa',
      focus: 'Use the morning well, then arrive in Kanazawa without friction.',
      leaveBy: 'Afternoon bus',
      fixed: ['Morning Takayama sightseeing', 'Bus to Kanazawa', 'Minn Kanazawa check-in flow'],
      optional: ['Station sushi dinner', 'Short night walk if arrival is smooth'],
      food: ['Takayama breakfast', 'Simple Kanazawa arrival dinner'],
      backup: 'Default to an easy evening because the next two Kanazawa days are full.',
      blossom: 'No pressure. Save energy.'
    },
    {
      id: 'day-2026-03-26',
      date: '2026-03-26',
      city: 'Kanazawa',
      title: 'Gardens market and geisha districts',
      hotelId: 'stay-kanazawa',
      focus: 'A polished Kanazawa day with garden, market, and traditional districts.',
      leaveBy: 'Early morning',
      fixed: ['Kenrokuen at opening feel', 'Ishiura Shrine', 'Castle grounds', 'Oyama Shrine', 'Market lunch', 'Geisha district block'],
      optional: ['Morihachi stop', 'Night stroll if energy is good'],
      food: ['Omicho seafood lunch', 'Kanazawa station sushi or curated spots from the food file'],
      backup: 'If the morning runs long, trim the afternoon to one district plus dinner.',
      blossom: 'Garden timing matters but the day still works even without peak bloom.'
    },
    {
      id: 'day-2026-03-27',
      date: '2026-03-27',
      city: 'Kanazawa',
      title: 'Samurai district and second Kanazawa day',
      hotelId: 'stay-kanazawa',
      focus: 'A more museum and district focused Kanazawa day.',
      leaveBy: 'Morning start',
      fixed: ['Samurai district', 'Myoryuji', 'Nishi Chaya', 'Ninja weapon museum or villa style choice'],
      optional: ['D.T. Suzuki Museum', 'Night illumination walk after dinner'],
      food: ['Refined lunch and a relaxed dinner'],
      backup: 'Use one museum and one district if the day feels too packed.',
      blossom: 'Use evening atmosphere if blossoms are on time.'
    },
    {
      id: 'day-2026-03-28',
      date: '2026-03-28',
      city: 'Kyoto',
      title: 'Kyoto arrival and Southern Higashiyama night',
      hotelId: 'stay-kyoto',
      focus: 'Arrive efficiently, then pivot into one beautiful Kyoto evening without burning out.',
      leaveBy: 'Travel day',
      fixed: ['Kanazawa to Kyoto via Tsuruga', 'Drop luggage at hotel', 'Yoshida area afternoon loop', 'Night illumination route'],
      optional: ['Shōren-in', 'Maruyama Park', 'Gion Shirakawa'],
      food: ['Quick station lunch or Kobushi Ramen', 'Reserved or planned dinner near evening route'],
      backup: 'Late start version should cut the afternoon and preserve only the strongest evening stretch.',
      blossom: 'One of the first truly timing sensitive Kyoto days.'
    },
    {
      id: 'day-2026-03-29',
      date: '2026-03-29',
      city: 'Kyoto',
      title: 'Arashiyama dawn and west Kyoto arc',
      hotelId: 'stay-kyoto',
      focus: 'Beat the crowds in Arashiyama, then choose carefully how much to keep for the late afternoon and evening.',
      leaveBy: 'Before 06:00',
      fixed: ['Arashiyama Bamboo Grove', 'Tenryū-ji', 'Ōkōchi Sansō', 'Saga Toriimoto corridor'],
      optional: ['Otagi Nenbutsu-ji', 'Adashino Nenbutsu-ji', 'Gio-ji', 'To-ji illumination'],
      food: ['Arashiyama breakfast bite', 'Simple dinner near the hotel or on the way back'],
      backup: 'If the western loop is too much, keep only the strongest temple cluster and save energy.',
      blossom: 'Crowd timing matters more than blossom timing here.'
    },
    {
      id: 'day-2026-03-30',
      date: '2026-03-30',
      city: 'Kyoto',
      title: 'Northern Higashiyama and garden day',
      hotelId: 'stay-kyoto',
      focus: 'A very high value Kyoto day with philosophical path atmosphere, gardens, and an evening event.',
      leaveBy: 'Before 06:30',
      fixed: ['Philosopher’s Path', 'Hōnen-in', 'Keage Incline', 'Nanzen-ji area', 'Eikan-dō or selected gardens', 'Kyoto Handicraft Center', 'teamLab Biovortex Kyoto in evening'],
      optional: ['Murin-an', 'Konchi-in', 'Tenju-an', 'Heian Shrine garden'],
      food: ['Tea break in Nanzen-ji area', 'Late lunch after Handicraft Center'],
      backup: 'Choose one big garden moment instead of trying to do every garden.',
      blossom: 'This day is partly blossom and partly garden quality. Do not overschedule.'
    },
    {
      id: 'day-2026-03-31',
      date: '2026-03-31',
      city: 'Kyoto',
      title: 'Fushimi Inari dawn then Daigo-ji and downtown lights',
      hotelId: 'stay-kyoto',
      focus: 'One of the most ambitious days, so transport choices and taxi shortcuts matter.',
      leaveBy: '05:10 by train or 05:50 by taxi',
      fixed: ['Fushimi Inari at dawn', 'Daigo-ji lower complex', 'Downtown evening walk'],
      optional: ['Kami Daigo hike', 'Imperial Palace Park weeping cherries', 'Arcades', 'Pontochō and Kiyamachi canal'],
      food: ['Lawson breakfast at Fushimi Inari entrance', 'Lunch near Daigo Station or downtown early dinner'],
      backup: 'Use taxis to protect the day and skip Kami Daigo unless everyone feels strong.',
      blossom: 'Daigo-ji lower section is a major blossom priority.'
    },
    {
      id: 'day-2026-04-01',
      date: '2026-04-01',
      city: 'Kyoto to Tokyo',
      title: 'Southern Higashiyama dawn and Tokyo return',
      hotelId: 'stay-tokyo-2',
      focus: 'Squeeze one last iconic Kyoto morning out of the trip without risking the Tokyo transfer.',
      leaveBy: '05:45 by taxi',
      fixed: ['Kiyomizu-dera at 06:00', 'Ninenzaka and Sannenzaka', 'Nene no Michi', 'Gion quiet lanes', 'Return for luggage by 14:00', 'Train to Tokyo around 15:00'],
      optional: ['Entoku-in', 'Kennin-ji', 'Sanjūsangen-dō'],
      food: ['Breakfast in Gion or Ninenzaka pocket', 'Train snacks for the ride'],
      backup: 'If the morning stretches long, skip the optional temple and protect the train.',
      blossom: 'This is one of the most atmospheric Kyoto mornings in the whole trip.'
    },
    {
      id: 'day-2026-04-02',
      date: '2026-04-02',
      city: 'Tokyo',
      title: 'Shinjuku Gyoen morning and design shopping afternoon',
      hotelId: 'stay-tokyo-2',
      focus: 'A softer Tokyo day led by sakura and good design stores.',
      leaveBy: 'Morning',
      fixed: ['Shinjuku Gyoen with Yasuji at 10:00'],
      optional: ['Meiji Shrine', 'Harajuku', 'Aoyama cemetery', 'Aoyama and Omotesando shopping cluster'],
      food: ['Lunch near Shinjuku Gyoen or Shinjuku Station', 'Dinner after shopping if energy is good'],
      backup: 'If the garden takes longer, trim the design loop to only the strongest stores.',
      blossom: 'One of the highest value Tokyo sakura windows.'
    },
    {
      id: 'day-2026-04-03',
      date: '2026-04-03',
      city: 'Tokyo',
      title: 'Final Tokyo flex day and sakura finale',
      hotelId: 'stay-tokyo-2',
      focus: 'Use the last full day to cover remaining priorities and end with the best blossom night walk.',
      leaveBy: 'Early if doing park first',
      fixed: ['Rikugien or another morning sakura option', 'Shopping block', 'Night sakura finale at Nakameguro or Chidorigafuchi'],
      optional: ['Ueno Park at 07:00', 'Sumida walk', 'Asakusa shrine', 'Kanda River hidden sakura', 'Loft Shibuya', 'Akihabara'],
      food: ['Keep lunch flexible around where the day actually lands'],
      backup: 'If everyone wants a calmer last day, choose only one garden, one shopping zone, and one evening finale.',
      blossom: 'This is the main finale day. Keep it emotionally generous rather than overstuffed.'
    },
    {
      id: 'day-2026-04-04',
      date: '2026-04-04',
      city: 'Departure',
      title: 'Haneda departure day',
      hotelId: 'stay-tokyo-2',
      focus: 'Easy departure with zero drama.',
      leaveBy: '06:30',
      fixed: ['Leave hotel around 06:30', 'HND flight at 10:50'],
      optional: [],
      food: ['Airport breakfast'],
      backup: 'Pack fully the night before and keep the final morning simple.',
      blossom: 'Not applicable.'
    }
  ],
  attractions: [
    {
      id: 'attr-sensoji',
      city: 'Tokyo',
      title: 'Senso-ji and Asakusa morning',
      category: 'Temple district',
      bestWhen: 'Dawn or very early morning',
      duration: '60 to 120 min',
      ops: 'Arrival-day friendly. Best before crowds and before the shopping street fully wakes up.',
      story: 'This is the calm, traditional counterweight to the long flight. Lanterns, side lanes, and early temple energy make it ideal for landing day.',
      tip: 'Walk the small side lanes after the main approach so the first Tokyo memory feels quieter and more personal.'
    },
    {
      id: 'attr-teamlab',
      city: 'Tokyo',
      title: 'teamLab immersive slot',
      category: 'Experience',
      bestWhen: 'Timed reservation',
      duration: '90 to 120 min',
      ops: 'Treat the entry time as fixed. Clothing and shoe choices matter for comfort.',
      story: 'This is the trip’s deliberate sensory contrast to the older neighborhoods. It works best as a contained experience with clean before and after logistics.',
      tip: 'Keep the surrounding schedule light so the family is not rushed.'
    },
    {
      id: 'attr-matsumoto-castle',
      city: 'Matsumoto',
      title: 'Matsumoto Castle and old quarter',
      category: 'Castle town',
      bestWhen: 'Afternoon arrival or morning reset',
      duration: '2 to 4 hours',
      ops: 'Easy to pair with Nakamachi and Nawate.',
      story: 'Matsumoto changes the trip’s tempo. After Tokyo, the dark castle and merchant quarter feel slower, older, and more grounded.',
      tip: 'Do Nawate earlier if possible because its small shops close first.'
    },
    {
      id: 'attr-takayama-oldtown',
      city: 'Takayama',
      title: 'Takayama old town',
      category: 'Historic district',
      bestWhen: 'Late afternoon or calm morning',
      duration: '2 to 3 hours',
      ops: 'Works well as a low-stress arrival walk.',
      story: 'Takayama gives you alpine town atmosphere and food momentum without needing a huge formal schedule.',
      tip: 'Do not overschedule the arrival day. Let the streets carry the mood.'
    },
    {
      id: 'attr-kenrokuen',
      city: 'Kanazawa',
      title: 'Kenrokuen and castle morning',
      category: 'Garden',
      bestWhen: 'Early morning',
      duration: '2 to 3 hours',
      ops: 'Pair with Ishiura Shrine and castle grounds while the day is still fresh.',
      story: 'This is a polished, elegant Kanazawa morning with high visual payoff and a calmer rhythm before the market crowds.',
      tip: 'Start with the garden, then widen outward toward the castle and shrine zone.'
    },
    {
      id: 'attr-gion-night',
      city: 'Kyoto',
      title: 'Southern Higashiyama evening light up loop',
      category: 'Atmosphere walk',
      bestWhen: 'After dark',
      duration: '2 to 4 hours',
      ops: 'Best on arrival day only if the family still has enough energy after the transfer.',
      story: 'This is one of the trip’s signature Kyoto experiences: stone lanes, temple illumination, and old-quarter atmosphere at night.',
      tip: 'Do not chase everything. One beautiful stretch done calmly is better than trying to complete the full list.'
    },
    {
      id: 'attr-arashiyama',
      city: 'Kyoto',
      title: 'Arashiyama at dawn',
      category: 'District route',
      bestWhen: 'Very early morning',
      duration: 'Half day',
      ops: 'Leaving before 06:00 protects the best part of the morning.',
      story: 'The route works because the first hour belongs to you. Later, Arashiyama becomes much more crowded and less magical.',
      tip: 'Think of it as a dawn mission, not a casual late start area.'
    },
    {
      id: 'attr-philosophers-path',
      city: 'Kyoto',
      title: 'Philosopher’s Path and the Nanzen-ji garden zone',
      category: 'Walk + gardens',
      bestWhen: 'Early morning into late morning',
      duration: 'Half day',
      ops: 'Pick one or two garden experiences instead of trying every ticketed stop.',
      story: 'This is peak Kyoto layering: canals, temple walls, side gardens, and the feeling of moving through different kinds of quiet.',
      tip: 'Decide in advance whether you want one big garden, several small Zen spaces, or a lighter path day.'
    },
    {
      id: 'attr-fushimi-daigoji',
      city: 'Kyoto',
      title: 'Fushimi Inari dawn and Daigo-ji',
      category: 'Dawn + sakura day',
      bestWhen: 'Before sunrise start',
      duration: 'Full day if combined',
      ops: 'Taxi shortcuts can materially improve the day.',
      story: 'This is one of the most ambitious but most rewarding Kyoto combinations because it stacks an iconic dawn shrine with one of the stronger blossom experiences.',
      tip: 'Use Lower Daigo as the core. Treat Kami Daigo as a bonus, not a requirement.'
    },
    {
      id: 'attr-kiyomizu-gion',
      city: 'Kyoto',
      title: 'Kiyomizu dawn and Gion quiet lanes',
      category: 'Final Kyoto morning',
      bestWhen: '06:00 onward',
      duration: 'Morning',
      ops: 'Protect the return-to-hotel deadline because this is also a transfer day.',
      story: 'This route is a concentrated farewell to Kyoto. It packs iconic views, old lanes, and quiet geisha-street atmosphere into one final morning.',
      tip: 'Use side lanes to reach Ninenzaka first and avoid the main Sannenzaka crowd funnel.'
    },
    {
      id: 'attr-shinjuku-gyoen',
      city: 'Tokyo',
      title: 'Shinjuku Gyoen sakura morning',
      category: 'Garden',
      bestWhen: 'Morning',
      duration: '2 to 3 hours',
      ops: 'This is one of the highest priority April Tokyo blossom stops.',
      story: 'A more polished, spacious sakura moment that balances the intensity of Kyoto with a calmer Tokyo elegance.',
      tip: 'Keep the afternoon intentionally lighter so the garden does not feel rushed.'
    },
    {
      id: 'attr-nakameguro',
      city: 'Tokyo',
      title: 'Nakameguro night sakura finale',
      category: 'Night walk',
      bestWhen: 'After sunset',
      duration: '60 to 120 min',
      ops: 'Best used as the emotional ending to the last full day if bloom timing cooperates.',
      story: 'This is the lantern-lit, riverside ending that gives the Tokyo finale its cinematic finish.',
      tip: 'Only do this if the family still has enough energy to enjoy it slowly.'
    }
  ],
  foodSpots: [
    {
      id: 'food-kyoto-kobushi',
      city: 'Kyoto',
      title: 'Kobushi Ramen',
      route: 'Around hotel / quick arrival meals',
      why: 'Very close to the hotel, low friction, strong ratings, and ideal for a tired arrival or reset dinner.',
      try: 'Shōyu ramen with ajitama egg',
      effort: '4 min from hotel',
      note: 'Cash and machine ordering make it good for a simple ops dinner.'
    },
    {
      id: 'food-kyoto-botaniq',
      city: 'Kyoto',
      title: 'BOTANIQ KAJIYA',
      route: 'Around hotel / calm breakfast or lunch',
      why: 'A soft, pleasant fallback when the family wants somewhere attractive but easy.',
      try: 'Sandwiches, open toasts, coffee',
      effort: '2 min from hotel',
      note: 'Useful when you need a reliable, calm meal near base.'
    },
    {
      id: 'food-kyoto-tonkatsu',
      city: 'Kyoto',
      title: 'Tonkatsu Ichiban',
      route: 'Near To-ji and hotel zone',
      why: 'A more specific, satisfying meal for a day when you want one memorable comfort-food stop.',
      try: 'Rosu katsu set or hire katsu set',
      effort: '8 min',
      note: 'Not every day, but a very good structured dinner option.'
    },
    {
      id: 'food-kanazawa-market',
      city: 'Kanazawa',
      title: 'Omicho Market seafood lunch',
      route: 'Kanazawa day core',
      why: 'It is the obvious high-payoff lunch move on the garden and market day.',
      try: 'Seafood donburi or sushi',
      effort: 'Built into the route',
      note: 'Best used as the natural midday pivot.'
    },
    {
      id: 'food-kanazawa-station-sushi',
      city: 'Kanazawa',
      title: 'Station sushi on arrival or departure',
      route: 'Easy fallback',
      why: 'Excellent stress-reduction meal when the family is moving between cities.',
      try: 'Quick sushi dinner',
      effort: 'Very low',
      note: 'A true operations-friendly food decision.'
    },
    {
      id: 'food-matsumoto-soba',
      city: 'Matsumoto',
      title: 'Matsumoto soba stop',
      route: 'Castle / old-town day',
      why: 'Soba is one of the strongest local fits and keeps the city mood coherent.',
      try: 'Local soba and simple set meal',
      effort: 'Easy in the center',
      note: 'Great for a light but memorable regional meal.'
    },
    {
      id: 'food-takayama-hida',
      city: 'Takayama',
      title: 'Hida beef meal',
      route: 'Takayama core',
      why: 'A classic Takayama signature that makes even a short stay feel distinctive.',
      try: 'Hida beef in a simple format you can get quickly',
      effort: 'Center-friendly',
      note: 'Choose an easy version if the day is already busy.'
    },
    {
      id: 'food-tokyo-aoyama-loop',
      city: 'Tokyo',
      title: 'Aoyama and Omotesando coffee and lunch loop',
      route: 'Design shopping afternoon',
      why: 'Useful because it fits the design-store cluster instead of pulling the family away from it.',
      try: 'Casual lunch and good coffee in the shopping zone',
      effort: 'Very low once in the area',
      note: 'Keep the day elegant and low-friction.'
    }
  ],
  phraseCards: [
    {
      id: 'phrase-station',
      category: 'Station',
      jp: 'この駅はどこですか？',
      romaji: 'Kono eki wa doko desu ka?',
      en: 'Where is this station?',
      use: 'Show or speak when navigating transfers.'
    },
    {
      id: 'phrase-reservation',
      category: 'Hotel',
      jp: '予約があります。',
      romaji: 'Yoyaku ga arimasu.',
      en: 'We have a reservation.',
      use: 'Hotel check-in or restaurant arrival.'
    },
    {
      id: 'phrase-three',
      category: 'Restaurant',
      jp: '三人です。',
      romaji: 'San nin desu.',
      en: 'Three people.',
      use: 'Seating and restaurant entry.'
    },
    {
      id: 'phrase-help-find',
      category: 'Navigation',
      jp: 'この場所を探しています。',
      romaji: 'Kono basho o sagashite imasu.',
      en: 'We are looking for this place.',
      use: 'Show with a map or address.'
    },
    {
      id: 'phrase-bill',
      category: 'Restaurant',
      jp: 'お会計お願いします。',
      romaji: 'Okaikei onegaishimasu.',
      en: 'The bill, please.',
      use: 'Quick dining interaction.'
    }
  ],
  reminders: [
    {
      id: 'reminder-kyoto-early-starts',
      date: '2026-03-28',
      title: 'Kyoto days start early',
      note: 'The most crowded Kyoto routes depend on pre 08:00 starts. Prepare clothes, snacks, and station cards the night before.'
    },
    {
      id: 'reminder-final-night',
      date: '2026-04-03',
      title: 'Pack fully tonight',
      note: 'Departure day should be easy. Prepare bags and airport plan before bed.'
    }
  ],
  updatesHistory: [],
  inbox: [],
  changeLog: [
    {
      id: 'seed-load',
      at: 'Initial build',
      note: 'Loaded trip structure from the uploaded Japan archive and prebuilt companion content.'
    }
  ]
};
