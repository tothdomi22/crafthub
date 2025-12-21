-- ==========================================
-- 1. MAIN CATEGORIES (Főkategóriák)
-- ==========================================

INSERT INTO main_category (id, display_name, unique_name, description)
VALUES (1, 'Ékszerek', 'ekszerek', 'Egyedi kézzel készített ékszerek, drágakövek és kiegészítők.'),
       (2, 'Ruházat és Cipők', 'ruhazat-es-cipok', 'Tervezői darabok, kézzel varrt ruhák és lábbelik.'),
       (3, 'Otthon és Lakberendezés', 'otthon-es-lakberendezes', 'Dekoráció, bútorok, konyhai eszközök és lakástextil.'),
       (4, 'Játékok és Szórakozás', 'jatekok-es-szorakozas', 'Játékok gyerekeknek és felnőtteknek, hangszerek.'),
       (5, 'Művészet és Gyűjtemények', 'muveszet-es-gyujtemenyek', 'Eredeti festmények, szobrok, nyomatok és ritkaságok.'),
       (6, 'Alapanyagok és Eszközök', 'alapanyagok-es-eszkozok', 'Kellékek alkotóknak: fonalak, gyöngyök, szerszámok.'),
       (7, 'Esküvő és Rendezvény', 'eskuvo-es-rendezveny', 'Dekorációk, meghívók és kiegészítők nagy napokra.'),
       (8, 'Szépségápolás', 'szepsegapolas', 'Kézműves szappanok, kozmetikumok és illóolajok.'),
       (9, 'Kisállat Felszerelés', 'kisallat-felszereles', 'Nyakörvek, fekhelyek és játékok házi kedvenceknek.'),
       (10, 'Táskák és Kiegészítők', 'taskak-es-kiegeszitok', 'Hátizsákok, pénztárcák, övek és sálak.'),
       (11, 'Digitális Termékek', 'digitalis-termekek', 'Letölthető grafikák, minták és sablonok.'),
       (12, 'Vintage és Régiségek', 'vintage', 'Legalább 20 éves, különleges és ritka tárgyak.'),
       (13, '3D Nyomtatás', '3d-nyomtatas', 'Egyedi nyomtatott figurák, alkatrészek, litofánok és modellek.'),
       (14, 'Tech és Kiegészítők', 'tech-kiegeszitok', 'Artisan billentyűzetek, egyedi kábelek, modding és gadgetek.');

-- ==========================================
-- 2. SUB CATEGORIES (Alkategóriák)
-- ==========================================

-- 1. ÉKSZEREK
INSERT INTO sub_category (main_category_id, display_name, unique_name, description)
VALUES (1, 'Nyakláncok', 'nyaklancok', 'Medálok, láncok, gyöngysorok és gallérok.'),
       (1, 'Fülbevalók', 'fulbevalok', 'Beszúrós, lógós, karika és klipszes fülbevalók.'),
       (1, 'Gyűrűk', 'gyuruk', 'Eljegyzési, pecsét-, drágaköves és divatgyűrűk.'),
       (1, 'Karkötők', 'karkotok', 'Fonott, merevfalú és láncos karkötők.'),
       (1, 'Hajékszerek', 'hajekszerek', 'Tiara, hajtű, hajpánt és csatok.'),
       (1, 'Testékszerek', 'testekszerek', 'Piercingek, bokaláncok és orrékszerek.'),
       (1, 'Férfi ékszerek', 'ferfi-ekszerek', 'Mandzsettagombok, nyakkendőtűk és gyűrűk.'),
       (1, 'Ékszerdobozok és tárolók', 'ekszerdobozok', 'Dobozok, állványok és tasakok.'),
       (1, 'Egyéb Ékszerek', 'ekszerek-egyeb', 'Minden más ékszer.');

-- 2. RUHÁZAT ÉS CIPŐK
INSERT INTO sub_category (main_category_id, display_name, unique_name, description)
VALUES (2, 'Női ruházat', 'noi-ruhazat', 'Ruhák, szoknyák, blúzok és felsők.'),
       (2, 'Férfi ruházat', 'ferfi-ruhazat', 'Ingek, pólók, zakók és nadrágok.'),
       (2, 'Gyerek és Babaruhák', 'gyerek-babaruhak', 'Rugaldalózók, kiscipők és gyerekruha szettek.'),
       (2, 'Cipők és Lábbelik', 'cipok', 'Csizmák, szandálok, papucsok és egyedi cipők.'),
       (2, 'Jelmezek és Cosplay', 'jelmezek', 'Farsangi és cosplay jelmezek, maszkok.'),
       (2, 'Egyéb Ruházat', 'ruhazat-egyeb', 'Egyéb ruházati termékek.');

-- 3. OTTHON ÉS LAKBERENDEZÉS
INSERT INTO sub_category (main_category_id, display_name, unique_name, description)
VALUES (3, 'Fali dekoráció', 'fali-dekoracio', 'Képek, faliszőnyegek, órák és tükrök.'),
       (3, 'Párnák és Takarók', 'parnak-takarok', 'Díszpárnák, ágytakarók és plédek.'),
       (3, 'Konyha és Étkező', 'konyha-etkezo', 'Kerámiák, vágódeszkák, terítők és poháralátétek.'),
       (3, 'Gyertyák és Illatosítók', 'gyertyak-illatok', 'Szójagyertyák, illóolajok és párologtatók.'),
       (3, 'Bútorok', 'butorok', 'Kisbútorok, polcok, asztalok és székek.'),
       (3, 'Fürdőszoba', 'furdoszoba', 'Szappantartók, törölközők és tárolók.'),
       (3, 'Kert és Növények', 'kert-novenyek', 'Kaspók, kerti díszek és növénytámaszok.'),
       (3, 'Egyéb Otthon', 'otthon-egyeb', 'Egyéb lakberendezési tárgyak.');

-- 4. JÁTÉKOK ÉS SZÓRAKOZÁS
INSERT INTO sub_category (main_category_id, display_name, unique_name, description)
VALUES (4, 'Plüssök és Babák', 'plussok-babak', 'Horgolt amigurumi, rongybabák és mackók.'),
       (4, 'Fajátékok', 'fajatekok', 'Építőkockák, vonatok és készségfejlesztő fajátékok.'),
       (4, 'Társasjátékok és Kártyák', 'tarsasjatekok', 'Egyedi tervezésű társasok, sakk és kártyapaklik.'),
       (4, 'Hangszerek', 'hangszerek', 'Gitárok, dobok, sípok és kiegészítők.'),
       (4, 'Szerepjáték Kellékek', 'rpg-kellekek', 'Dobókockák, tálcák és D&D kiegészítők.'),
       (4, 'Egyéb Játékok', 'jatekok-egyeb', 'Minden más játék.');

-- 5. MŰVÉSZET ÉS GYŰJTEMÉNYEK
INSERT INTO sub_category (main_category_id, display_name, unique_name, description)
VALUES (5, 'Festmények', 'festmenyek', 'Olaj, akril, akvarell és vegyes technika.'),
       (5, 'Nyomatok és Poszterek', 'nyomatok', 'Limitált szériás printek és grafikák.'),
       (5, 'Szobrászat', 'szobraszat', 'Agyag, fém, fa és üvegszobrok.'),
       (5, 'Fotográfia', 'fotografia', 'Művészi fotók és nyomatok.'),
       (5, 'Üvegművészet', 'uvegmuveszet', 'Ólomüveg, fúvott üveg és dísztárgyak.'),
       (5, 'Egyéb Művészet', 'muveszet-egyeb', 'Egyéb művészeti alkotások.');

-- 6. ALAPANYAGOK ÉS ESZKÖZÖK
INSERT INTO sub_category (main_category_id, display_name, unique_name, description)
VALUES (6, 'Fonalak és Varrás', 'fonalak-varras', 'Szövetek, gombok, fonalak és tűk.'),
       (6, 'Ékszerkészítés', 'ekszerkeszites', 'Gyöngyök, kapcsok, drótok és szerszámok.'),
       (6, 'Papír és Írószer', 'papir-iroszer', 'Matricák, washi tapek, bélyegzők és naplók.'),
       (6, 'Festés és Rajzolás', 'festes-rajzolas', 'Ecsetek, vásznak, festékek és ceruzák.'),
       (6, 'Szobrászat és Öntés', 'szobraszat-ontes', 'Agyag, gyanta, szilikon formák és gipsz.'),
       (6, '3D Nyomtató Filamentek', 'filamentek', 'Speciális vagy maradék filamentek.'),
       (6, 'Egyéb Alapanyag', 'alapanyag-egyeb', 'Minden más alkotói kellék.');

-- 7. ESKÜVŐ ÉS RENDEZVÉNY
INSERT INTO sub_category (main_category_id, display_name, unique_name, description)
VALUES (7, 'Meghívók és Papíráru', 'meghivok', 'Esküvői meghívók, ültetőkártyák és menük.'),
       (7, 'Esküvői Dekoráció', 'eskuvoi-dekor', 'Asztaldíszek, fényfüzérek és táblák.'),
       (7, 'Köszönetajándékok', 'koszonetajandekok', 'Apró ajándékok a vendégeknek.'),
       (7, 'Menyasszonyi Kiegészítők', 'menyasszonyi-kiegeszitok', 'Fátylak, övek és hajdíszek.'),
       (7, 'Parti Kellékek', 'parti-kellekek', 'Lufik, tortadíszek és bannerek.'),
       (7, 'Egyéb Rendezvény', 'rendezveny-egyeb', 'Egyéb parti és esküvői kellékek.');

-- 8. SZÉPSÉGÁPOLÁS
INSERT INTO sub_category (main_category_id, display_name, unique_name, description)
VALUES (8, 'Fürdő és Testápolás', 'furdo-testapolas', 'Fürdőbomba, testvaj, sók és radírok.'),
       (8, 'Szappanok', 'szappanok', 'Kézműves hidegen sajtolt és illatosított szappanok.'),
       (8, 'Arcápolás', 'arcapolas', 'Krémek, olajok, maszkok és ajakbalzsamok.'),
       (8, 'Smink és Kozmetikum', 'smink', 'Natúr sminktermékek és ecsetek.'),
       (8, 'Egyéb Szépség', 'szepseg-egyeb', 'Egyéb kozmetikai termékek.');

-- 9. KISÁLLAT FELSZERELÉS
INSERT INTO sub_category (main_category_id, display_name, unique_name, description)
VALUES (9, 'Nyakörvek és Pórázok', 'nyakorvek-porazok', 'Egyedi bőr és textil nyakörvek.'),
       (9, 'Fekhelyek és Bútorok', 'fekhelyek', 'Kutyaházak, macskabútorok és párnák.'),
       (9, 'Kisállat Ruhák', 'kisallat-ruhak', 'Kutyaruhák, kendők és jelmezek.'),
       (9, 'Jutalomfalatok', 'jutalomfalatok', 'Házi készítésű kekszek és rágcsálnivalók.'),
       (9, 'Egyéb Kisállat', 'kisallat-egyeb', 'Tálak, biléták és egyéb felszerelés.');

-- 10. TÁSKÁK ÉS KIEGÉSZÍTŐK
INSERT INTO sub_category (main_category_id, display_name, unique_name, description)
VALUES (10, 'Hátizsákok', 'hatizsakok', 'Vászon, bőr és túra hátizsákok.'),
       (10, 'Kézitáskák', 'kezitaskak', 'Válltáskák, tote bag-ek és borítéktáskák.'),
       (10, 'Pénztárcák', 'penztarcak', 'Bőr és textil tárcák.'),
       (10, 'Sálak és Kendők', 'salak-kendok', 'Kötött sálak, selyemkendők.'),
       (10, 'Kulcstartók', 'kulcstartok', 'Egyedi kulcstartók és díszek.'),
       (10, 'Egyéb Kiegészítő', 'kiegeszito-egyeb', 'Övek, kitűzők és egyéb kiegészítők.');

-- 11. DIGITÁLIS TERMÉKEK
INSERT INTO sub_category (main_category_id, display_name, unique_name, description)
VALUES (11, 'Grafikák és Illusztrációk', 'grafikak', 'Logók, clip art és vektorok.'),
       (11, 'Nyomtatható Dekoráció', 'nyomtathato-dekor', 'Fali képek, naptárak és tervezők.'),
       (11, 'Sablonok és Minták', 'sablonok-mintak', 'STL fájlok, kötésminták és varrásminták.'),
       (11, 'Betűtípusok', 'betutipusok', 'Egyedi fontok és tipográfia.'),
       (11, 'Egyéb Digitális', 'digitalis-egyeb', 'Presetek, filterek és egyéb fájlok.');

-- 12. VINTAGE ÉS RÉGISÉGEK
INSERT INTO sub_category (main_category_id, display_name, unique_name, description)
VALUES (12, 'Vintage Ruházat', 'vintage-ruhazat', 'Retro ruhák, kabátok és cipők.'),
       (12, 'Vintage Lakberendezés', 'vintage-lakberendezes', 'Régi bútorok, vázák és szőnyegek.'),
       (12, 'Könyvek és Papíráru', 'vintage-konyvek', 'Régi könyvek, képeslapok és magazinok.'),
       (12, 'Egyéb Vintage', 'vintage-egyeb', 'Minden más régiség.');

-- ==========================================
-- 13. 3D NYOMTATÁS
-- ==========================================
INSERT INTO sub_category (main_category_id, display_name, unique_name, description)
VALUES (13, 'Figurák és Miniatűrök', 'figurak-miniaturok', 'Tabletop játékokhoz, D&D figurák, gyűjthető szobrok.'),
       (13, 'Cosplay Kellékek', 'cosplay-kellekek', 'Sisakok, fegyver replikák, páncél elemek.'),
       (13, 'Hasznos Holmik', 'hasznos-holmik', 'Rendezők, tartók, kampók és javító elemek.'),
       (13, 'Litofánok és Lámpák', 'litofanok', 'Egyedi fényképes litofánok és világító dobozok.'),
       (13, 'Alkatrészek és Modok', '3d-alkatreszek', 'Nyomtató alkatrészek, upgradek és kiegészítők.'),
       (13, 'Egyéb 3D Nyomtatott', '3d-egyeb', 'Minden más 3D nyomtatott termék.');

-- ==========================================
-- 14. TECH ÉS KIEGÉSZÍTŐK
-- ==========================================
INSERT INTO sub_category (main_category_id, display_name, unique_name, description)
VALUES (14, 'Billentyűzet Kiegészítők', 'billentyuzet-kellekek', 'Artisan keycapek, switchek, egyedi házak.'),
       (14, 'Egyedi Kábelek', 'egyedi-kabelek', 'Fonott, spirális (coiled) kábelek billentyűzethez és töltéshez.'),
       (14, 'Asztali Setup', 'asztali-setup', 'Fejhallgató tartók, kábelfésűk, monitor magasítók.'),
       (14, 'Telefontokok és Tartók', 'telefon-kiegeszitok', 'Egyedi festett vagy nyomtatott tokok és állványok.'),
       (14, 'PC Modding', 'pc-modding', 'Fan grillek, GPU támaszok és gépház dekorációk.'),
       (14, 'Egyéb Tech', 'tech-egyeb', 'Minden más tech kütyü és kiegészítő.');