<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 27/07/16
 * Time: 14:41
 */

namespace Icap\TagwordsBundle\Controller;

//use Symfony\Bundle\FrameworkBundle\Controller\Controller as BaseController;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use UJM\ExoBundle\Entity\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller as BaseController;


use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Validator\Exception\MissingOptionsException;
use JMS\DiExtraBundle\Annotation as DI;



class TagwordsController extends BaseController
{


    /**
     * @Route("/aah", name="tagwords")
     *
     * @return Response
     */
    public function showAction()
    {

        return new Response('hello Tagworld!');
        //throw new \Exception('hello');
    }


    /**
     * @Route("/nuage", name="nuage_mots")
     */
    public function listAction()
    {
        $tab_banni =
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
                'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize',
                'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf', 'vingt', 'Un',
                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
                'avec', 'chez', 'par', 'dans', 'des', 'en', 'de', 'une', 'votre', 'meilleurs', 'entre',
                'entres', 'depuis', 'alors', 'ne', 'pas', 'du', 'meme', 'Cafe',
                'ou', 'nom', 'seuls', 'acceptes', 'ayant',
                'vos', 'votre', 'mes', 'mien', 'mien', 'tien', 'tiens', 'tout', 'toute', 'toutes',
                'que', 'quoi', 'qui', 'comment', 'peu', 'peut', 'pis', 'puis', 'pas',
                'chaque', 'chacun', 'chacune', 'qu',
                'son', 'ses', 'au', 'aux', 'se', 'sur', 'ce', 'ceux', 'cette', 'ca', 'ci', 'ceci', 'cela',
                'aussi', 'pour', 'petit', 'grand', 'moyen', 'large', 'haut', 'bas', 'milieu', 'droite',
                'gauche', 'centre', 'dit', 'etre', 'leur', 'leurs', 'plus', 'moin', 'moins',
                'es', 'est', 'sont', 'son', 'va', 'suis', 'ai', 'viens', 'quot', 'post',
            ];

        $em = $this->getDoctrine()->getManager(); ?>

        <h1>Nuage</h1>

        <form>

            <input type="number" name="choix_texte" min="1" max="200" value="1" step="1"/>

            <input type="number" name="choix_nombre" min="25" max="500" value="25">
            <input type="submit">

        </form>

        <?php                                                                           //choix du nombre de mots à afficher et la selection du texte

        if (empty($_GET['choix_texte'])) {
            $choix_texte = 1;
        } else {
            $choix_texte = $_GET['choix_texte'];
        }

        if (empty($_GET['choix_nombre'])) {
            $choix_nombre = 25;
        } else {
            $choix_nombre = $_GET['choix_nombre'];
        }

        $nuageInit = $em->getRepository('Entity:nuage')->bddNuage($choix_texte); // appele de la requete pour selectioner le texte

        if (!$nuageInit) {
            // si texte pas trouver

            throw $this->createNotFoundException('Text not found!');
        }

        $nuageString = serialize($nuageInit); // array-> string avec UTF8

        $o = strtoupper($nuageString);     //eviter les majuscules
        $z = strtolower($o);

        $nuageTest2 = strlen($z); // compte le nombre total de mots dans le texte

        $nuageStringRegex = preg_replace('/(\\n)/u', ' ', $z); // enlever le \n du texte

        $nuageStringSansHtml = htmlspecialchars($nuageStringRegex); // enlever HTML

        $nuageStringRegex2 = preg_filter('/[^\w \xC0-\xFF]/u', ' ', $nuageStringSansHtml); /// enlever caractere spéciaux

        $nuagecount = str_word_count($nuageStringRegex2, 1, 'éèêëàäâôöïîûùüÿç€$£#&@ÉÇÀÁÂÈÉÊËÌÍÍÏÒÓÔÕÖÙÚÛ'); //  string -> array

        $nuageTrie = array_diff($nuagecount, $tab_banni); // enlever mots non-pertinent

        $nuageCompte = array_count_values($nuageTrie); // compte les mots

        $b = array_keys($nuageCompte);    // transpose les mots du texte à comparé pour la base de données

        /////YAML/////
        /* $value = array();
        try {

            $value = Yaml::parse(file_get_contents('/root/PhpstormProjects/untitled/frenchLexique.yaml'));
        }catch(ParseException $e){
            printf("Unable to parse the YAML string: %s", $e->getMessage());
        }


        $t = array_column($value, 'texte');
        $y = array_intersect($b, $t);

        $u = array();
        foreach ($value as $val){


            if (empty(array_intersect($y, $val))){

            }
            else {
                array_push($u, $val);

            }

        }*/

        /////BDD/////
        $u = [];
        $nuagePert = $em->getRepository('Entity:texte')->bddTest($b);      //requête pour récuperer les mots de lexique
        foreach ($nuagePert as $iop) {                      //objet recuperer de la bdd et transformer en array
            if (is_object($iop)) {
                $ert = $iop->serialize();
                array_unshift($u, $ert);
            }
        }

        $g = array_column($u, 'texte');

        $tableau = [];
        $tableau2 = [];

        foreach ($nuageCompte as $mot2 => $mot_valeur) {
            //associer chaque mot avec sa valeur et son ratio

            $qsd = ($mot_valeur / $nuageTest2);

            if (array_search($mot2, $g, true)) {
                $wxc = array_column($u, 'ratio');
                $dfg = current($wxc);
                $c = $qsd / $dfg;

                if ($mot_valeur > 2) {
                    $tm = ($mot2);
                    $tc = ($c);
                    $tmt = ($mot_valeur);
                    array_push($tableau, ['mot' => $tm, 'ratio' => $tc,  'occu' => $tmt]);
                }
            } else {
                $c = 0;

                if ($mot_valeur > 2) {
                    $tm = ($mot2);
                    $tc = ($c);
                    $tmt = ($mot_valeur);
                    array_unshift($tableau2, ['mot' => $tm, 'ratio' => $tc,  'occu' => $tmt]);
                }
            }
        }

        function array_sort(&$arr, $col, $dir = SORT_DESC)
        {      //function pour trié dans l'ordre que l'on veut
            $sort_col = [];

            foreach ($arr as $key => $row) {
                $sort_col[$key] = $row[$col];
            }

            array_multisort($sort_col, $dir, $arr);
        }

        array_sort($tableau, 'ratio');
        array_sort($tableau2, 'occu');

        $abc = array_merge_recursive($tableau2, $tableau);                //mettre les tableau des mots pertinents et non pertinents ensemble

        $nuageSlice = array_slice($abc, 0, $choix_nombre, true);                // choix du nombre à afficher

        $pp = array_column($nuageSlice, 'occu');                               // selection des nombres max pour faire les pourcentages
        $ppp = array_column($nuageSlice, 'ratio');

        $pppp = max($ppp);

        $p = current($pp);
        shuffle($nuageSlice);  // melange les mots pour que le rendu soit meilleur
        $nuageFinal = $nuageSlice;

        return $this->render('nuage/nuage.html.twig', [

            'nuageFinal' => $nuageFinal,
            'choix_nombre' => $choix_nombre,
            'occuration' => $p,
            'ratio' => $pppp,

        ]); // pour rendu passer les valeurs qu'on veut
    }

}