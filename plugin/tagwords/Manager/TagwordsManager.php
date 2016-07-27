<?php

namespace tagwords\Manager;


use tagwords\Entity\Ressources\TagwordsConfiguration;

use Doctrine\ORM\EntityRepository;

class TagwordsManager extends EntityRepository
{
    /**
     * @return TagwordsConfiguration\[]
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






