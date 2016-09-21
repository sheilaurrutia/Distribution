<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 01/09/16
 * Time: 10:12
 */
namespace Claroline\TextPlayerBundle\Repository;
use Claroline\TextPlayerBundle\Entity\nuage;
use Claroline\TextPlayerBundle\Entity\texte;
use Claroline\TextPlayerBundle\Controller\Tagwords;
use Doctrine\ORM\EntityRepository;

class NuageRepository extends EntityRepository
{

    /**
     * @return nuage[]
     */
    public function bddNuage($test) //requete pour selection le texte
    {
        return $this->createQueryBuilder('nuage')
            ->select('nuage.post')
            ->where('nuage.id = (:test)')
            ->setParameter('test', $test)
            ->getQuery()
            ->getResult();


    }


    /**
     * @return texte[]
     */
    public function bddTest($b) // requete pour la pour le lexique
    {

        return $this->createQueryBuilder('texte')
            ->select('texte')
            ->where('texte.texte IN (:mots)')
            ->setParameter('mots', $b, \Doctrine\DBAL\Connection::PARAM_STR_ARRAY)
            ->getQuery()
            ->getResult();
    }


}
