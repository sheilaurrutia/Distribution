<?php

namespace Icap\TagwordsBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class TagwordsController extends Controller
{
    /**
     * @Route("/nuage", name="nuage_mots")
     */
    public function listAction()
    {
        $bannedWords =
            [
                'mais', 'ou', 'et', 'donc', 'or', 'ni', 'car', 'dès',
                'je', 'il', 'lui', 'ils', 'elle', 'elles', 'nous', 'vous',
                'vos', 'votre', 'mes', 'mien', 'mien', 'tien', 'tiens',
                'tout', 'toute', 'toutes', 'à', 'on',
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'm', 'n', 'o', 'p', 'q',
                'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
                'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                'le', 'la', 'les', 'nos',
                'moi', 'me', 'toi', 'dont', 'quelque', 'jusqu', 'non', 'cet', 'jamais', 'tant', 'bien',
                'était', 'avait', 'ont', 'vers', 'quelqu', 'quoiqu', 'lorsqu', 'aujourd', 'hui', 'puisqu',
                'Lorsqu', 'voilà', 'te', 'Tu', 'dès', 'allez', 'autant', 'aucune', 'quiconque', 'dont', 'tu', 'Dès',
                'Vingt', 'jusque', 'Jusque', 'dont', 'Dont',
                'alors', 'au', 'aucuns', 'aussi', 'autre', 'avant', 'avec', 'avoir', 'bon', 'car', 'ce',
                'cela', 'ces', 'ceux', 'chaque', 'ci', 'comme', 'comment', 'dans', 'des', 'du', 'dedans',
                'dehors', 'depuis', 'deux', 'devrait', 'doit', 'donc', 'dos', 'droite', 'début', 'elle',
                'elles', 'en', 'encore', 'essai', 'est', 'et', 'eu', 'fait', 'faites', 'fois', 'font',
                'force', 'haut', 'hors', 'ici', 'il', 'ils', 'je juste', 'la', 'le', 'les', 'leur', 'là',
                'ma', 'maintenant', 'mais', 'mes', 'mine', 'moins', 'mon', 'mot', 'même', 'ni', 'nommés',
                'notre', 'nous', 'nouveaux', 'ou', 'où', 'par', 'parce', 'parole', 'pas', 'personnes',
                'peut', 'peu', 'pièce', 'plupart', 'pour', 'pourquoi', 'quand', 'que', 'quel', 'quelle',
                'quelles', 'quels', 'qui', 'sa', 'sans', 'ses', 'seulement', 'si', 'sien', 'son',
                'sont', 'sous', 'soyez sujet', 'sur', 'ta', 'tandis', 'tellement', 'tels', 'tes', 'ton',
                'tous', 'tout', 'trop', 'très', 'tu', 'valeur', 'voie', 'voient', 'vont', 'votre', 'vous',
                'vu', 'ça', 'étaient', 'état', 'étions', 'été', 'être', 'Elle', 'La', 'Et', 'En', 'Cela', 'Le',
                'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze',
                'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf', 'vingt', 'Un',
                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
                'avec', 'chez', 'par', 'dans', 'des', 'en', 'de', 'une', 'votre', 'meilleurs', 'entre',
                'entres', 'depuis', 'alors', 'ne', 'pas', 'du', 'meme', 'Cafe',
                'ou', 'nom', 'seuls', 'acceptes', 'ayant', 'gt', 'lt', 'amp',
                'vos', 'votre', 'mes', 'mien', 'mien', 'tien', 'tiens', 'tout', 'toute', 'toutes',
                'que', 'quoi', 'qui', 'comment', 'peu', 'peut', 'pis', 'puis', 'pas',
                'chaque', 'chacun', 'chacune', 'qu',
                'son', 'ses', 'au', 'aux', 'se', 'sur', 'ce', 'ceux', 'cette', 'ca', 'ci', 'ceci', 'cela',
                'aussi', 'pour', 'petit', 'grand', 'moyen', 'large', 'haut', 'bas', 'milieu', 'droite',
                'gauche', 'centre', 'dit', 'etre', 'leur', 'leurs', 'plus', 'moin', 'moins',
                'es', 'est', 'sont', 'son', 'va', 'suis', 'ai', 'viens', 'quot', 'post', 're',
            ];

        $em = $this->getDoctrine()->getManager(); ?>

        <h1>Nuage</h1>

        <form>

            <input type="checkbox" name="chooseSubject[]" value="1"/>
            <input type="checkbox" name="chooseSubject[]" value="2"/>
            <input type="checkbox" name="chooseSubject[]" value="3"/>
            <input type="checkbox" name="chooseSubject[]" value="4"/>
            <input type="checkbox" name="chooseSubject[]" value="5"/>
            <input type="checkbox" name="chooseSubject[]" value="6"/>
            <input type="checkbox" name="chooseSubject[]" value="7"/>

            <br />

            <input type="number" name="chooseNumber" min="25" max="500" value="25">

            <br />

            <input type="radio" name="chooseLanguage" value="french"/>
            <input type="radio" name="chooseLanguage" value="english"/>

            <input type="submit">

        </form>

        <?php // Choose the subject, the number of words to display and the language

        if (empty($_GET['chooseSubject'])) {
            $chooseSubject = [1];
        } else {
            $chooseSubject = $_GET['chooseSubject'];
        }

        if (empty($_GET['chooseNumber'])) {
            $chooseNumber = 25;
        } else {
            $chooseNumber = $_GET['chooseNumber'];
        }

        if (empty($_GET['chooseLanguage'])) {
            $chooseLanguage = 'french';
        } else {
            $chooseLanguage = $_GET['chooseLanguage'];
        }

        $selectionText = $em->getRepository('Claroline\ForumBundle\Entity\Message')->findBy([
            'subject' => $chooseSubject
        ]); // Select the messages in the forum by subjectId

        if (!$selectionText) { // if the subjectId not found
            throw $this->createNotFoundException('Text not found!');
        }

        $arrayContent = [];

        foreach ($selectionText as $textContent) {    // Take only the core of the message
            $arrayTemp = $textContent->getContent();
            array_unshift($arrayContent, $arrayTemp);
        }

        $serializeText = serialize($arrayContent); // Convert array to string

        $upperText = strtoupper($serializeText);     // For avoiding any uppercases letters/words

        $lowerText = strtolower($upperText);    // For avoiding any uppercases letters/words

        $lengthText = strlen($lowerText); // Count the length of the string

        $pregText = preg_replace('/(\\n)/u', ' ', $lowerText); // Avoid any \n

        $htmlText = html_entity_decode($pregText, ENT_HTML5);   // To have accentuation without html

        $htmlSpCharText = htmlspecialchars($htmlText); // To avoid any html code in the text

        $regexText = preg_filter('/[^\w \xC0-\xFF]/u', ' ', $htmlSpCharText); // To avoid any special chars

        $wordCountText = str_word_count(
            $regexText,
            1,
            'éèêëàäâôöïîûùüÿç€$£#&@ÉÇÀÁÂÈÉÊËÌÍÍÏÒÓÔÕÖÙÚÛ'
        ); //  To change string to array

        $relevantText = array_diff($wordCountText, $bannedWords); // To remove the banned words

        $countedText = array_count_values($relevantText); // To count the occurrence of the words

        $wordText = array_keys($countedText);    // To have the words ready for the query

        $tagwordsText = [];

        if ($chooseLanguage == 'french') {
            $tagwords = $em->getRepository(
                'Icap\TagwordsBundle\Entity\TagwordsFrench'
            )->Tagwords_french($wordText);      // The request to the database to have the data with the words
        } else {
            $tagwords = $em->getRepository(
                    'Icap\TagwordsBundle\Entity\TagwordsEnglish'
                )->Tagwords_english($wordText);      // The request to the database to have the data with the words
        }

        foreach ($tagwords as $tagword) {      // To serialize the data
            if (is_object($tagword)) {
                $tempArray = $tagword->serialize();
                array_unshift($tagwordsText, $tempArray);
            }
        }

        $wordText = array_column($tagwordsText, 'tagwords');

        $array = [];
        $array2 = [];

        foreach ($countedText as $word => $wordValue) { // to associate every word with its data
            $ratioValue1 = ($wordValue / $lengthText);

            if (array_search($word, $wordText, true)) {
                $ratioValue = array_column($tagwordsText, 'ratio');

                $ratioValue2 = current($ratioValue);

                $ratio = $ratioValue1 / $ratioValue2;

                if ($wordValue > 1) {
                    $tempWord = ($word);

                    $tempRatio = ($ratio);

                    $tempWordValue = ($wordValue);

                    array_push($array, ['word' => $tempWord, 'ratio' => $tempRatio,  'occu' => $tempWordValue]);
                }
            } else {
                $ratio = 0;

                if ($wordValue > 1) {
                    $tempWord = ($word);

                    $tempRatio = ($ratio);

                    $tempWordValue = ($wordValue);

                    array_unshift($array2, ['word' => $tempWord, 'ratio' => $tempRatio,  'occu' => $tempWordValue]);
                }
            }
        }

        function array_sort(&$arr, $col, $dir = SORT_DESC) // To sort the array by the data
        {
            $sort_col = [];

            foreach ($arr as $key => $row) {
                $sort_col[$key] = $row[$col];
            }
            array_multisort($sort_col, $dir, $arr);
        }

        array_sort($array, 'ratio');

        array_sort($array2, 'occu');

        $totalText = array_merge_recursive($array2, $array);  // To merge the 2 arrays

        $slicedText = array_slice($totalText, 0, $chooseNumber, true);   // To choose how many words to display

        $selectOccuration = array_column($slicedText, 'occu');  // To select for the display of the words

        $selectRatio = array_column($slicedText, 'ratio'); // To select for the display of the words

        $maxRatio = max($selectRatio); // To select the highest ratio possible

        $maxOccuration = current($selectOccuration); // To select the highest occurrences possible

        shuffle($slicedText);  // To shuffle the words to have a better visual

        $renderText = $slicedText;

        return $this->render('IcapTagwordsBundle:nuage:nuage.html.twig', [

            'renderText' => $renderText,
            'occuration' => $maxOccuration,
            'ratio' => $maxRatio,

        ]);
    }
}

?>
