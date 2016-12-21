<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * Author: Panagiotis TSAVDARIS
 *
 * Date: 4/13/15
 */

namespace Claroline\CoreBundle\Event\Notification;

use Symfony\Component\EventDispatcher\Event;

class NotificationParametersEvent extends Event
{
    private $types;

    public function __construct(array &$types)
    {
        $this->types = &$types;
    }

    public function getTypes()
    {
        return $this->types;
    }

    public function addTypes($typeNames, $hasParents, $group = null, $children = [])
    {
        if (is_string($typeNames)) {
            $typeNames = [$typeNames];
        }

        foreach ($typeNames as $typeName) {
            $this->types[] = ['name' => $typeName, 'group' => $group, 'hasParents' => $hasParents, 'children' => $children];
        }
    }
}
