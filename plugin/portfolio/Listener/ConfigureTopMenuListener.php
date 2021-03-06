<?php

namespace Icap\PortfolioBundle\Listener;

use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Menu\ConfigureMenuEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Knp\Menu\ItemInterface;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @DI\Service()
 */
class ConfigureTopMenuListener
{
    /**
     * @var TranslatorInterface
     */
    private $translator;

    /**
     * @var PlatformConfigurationHandler
     */
    private $platformConfigHandler;

    /**
     * @DI\InjectParams({
     *     "translator" = @DI\Inject("translator"),
     *     "platformConfigHandler" = @DI\Inject("claroline.config.platform_config_handler")
     * })
     */
    public function __construct(TranslatorInterface $translator, PlatformConfigurationHandler $platformConfigHandler)
    {
        $this->translator = $translator;
        $this->platformConfigHandler = $platformConfigHandler;
    }

    /**
     * @DI\Observe("claroline_top_bar_right_menu_configure_desktop_tool_my_portfolios")
     *
     * @param \Claroline\CoreBundle\Menu\ConfigureMenuEvent $event
     */
    public function onRightMenuConfigure(ConfigureMenuEvent $event)
    {
        $this->addPortfolioLink($event->getMenu());
    }

    /**
     * @DI\Observe("claroline_top_bar_left_menu_configure_desktop_tool_my_portfolios")
     *
     * @param \Claroline\CoreBundle\Menu\ConfigureMenuEvent $event
     */
    public function onLeftMenuConfigure(ConfigureMenuEvent $event)
    {
        $this->addPortfolioLink($event->getMenu());
    }

    protected function addPortfolioLink(ItemInterface $menu)
    {
        $menuItemConfig = ['route' => 'icap_portfolio_index'];

        if ($this->platformConfigHandler->getParameter('portfolio_url')) {
            $menuItemConfig = ['uri' => $this->platformConfigHandler->getParameter('portfolio_url')];
        }

        $menu
            ->addChild(
                $this->translator->trans('my_portfolios', [], 'icap_portfolio'),
                $menuItemConfig
            )
            ->setAttribute('class', 'dropdown')
            ->setAttribute('role', 'presentation')
            ->setExtra('title', $this->translator->trans('my_portfolios', [], 'icap_portfolio'))
            ->setExtra('icon', 'fa fa-list-alt');
    }
}
