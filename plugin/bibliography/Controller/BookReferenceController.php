<?php

namespace Icap\BibliographyBundle\Controller;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Icap\BibliographyBundle\Form\BookReferenceConfigurationType;
use Icap\BibliographyBundle\Form\BookReferenceType;
use Icap\BibliographyBundle\Manager\BookReferenceManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;

class BookReferenceController extends Controller
{
    private $formFactory;
    private $request;
    private $manager;

    /**
     * @DI\InjectParams({
     *     "formFactory"  = @DI\Inject("form.factory"),
     *     "requestStack" = @DI\Inject("request_stack"),
     *     "manager"      = @DI\Inject("icap.bibliography.manager")
     * })
     */
    public function __construct(
        FormFactory $formFactory,
        RequestStack $requestStack,
        BookReferenceManager $manager
    ) {
        $this->formFactory = $formFactory;
        $this->request = $requestStack->getCurrentRequest();
        $this->manager = $manager;
    }

    /**
     * @EXT\Route(
     *     "/change/{node}",
     *     name="icap_bibliography_change",
     *     options={"expose"=true}
     * )
     * @EXT\Template("IcapBibliographyBundle:BookReference:editForm.html.twig")
     */
    public function changeBookReferenceAction(ResourceNode $node)
    {
        if (!$this->get('security.authorization_checker')->isGranted('edit', $node)) {
            throw new AccessDeniedException();
        }

        $em = $this->getDoctrine()->getManager();
        $bookReference = $em->getRepository('IcapBibliographyBundle:BookReference')
            ->findOneBy(['resourceNode' => $node->getId()]);

        if (!$bookReference) {
            throw new \Exception("This resource doesn't exist.");
        }

        $form = $this->formFactory->create(new BookReferenceType(), $bookReference);
        $form->handleRequest($this->request);

        if ($form->isValid()) {
            $updatedBookReference = $form->getData();
            $resourceNode = $updatedBookReference->getResourceNode();
            $resourceNode->setName($updatedBookReference->getName());

            $em->flush();

            return new JsonResponse();
        }

        return ['form' => $form->createView(), 'node' => $node->getId()];
    }

    /**
     * @EXT\Route(
     *     "/configure/form",
     *     name="bibliography_config_form"
     * )
     * @EXT\ParamConverter("authenticatedUser", options={"authenticatedUser" = true})
     */
    public function pluginConfigureFormAction()
    {
        $config = $this->manager->getConfig();
        $form = $this->container->get('form.factory')->create(new BookReferenceConfigurationType(), $config);

        return $this->render(
            'IcapBibliographyBundle:BookReference:options.form.html.twig',
            ['form' => $form->createView(), 'id' => $config->getId()]
        );
    }

    /**
     * @EXT\Route("/update/configuration/{id}", name="bibliography_config_save")
     * @EXT\ParamConverter("config", class="BibliographyBundle:BookReferenceConfiguration")
     * @EXT\Method("POST")
     */
    public function updateConfigurationAction(BookReferenceConfiguration $config, Request $request)
    {
        $postData = $request->request->get('audio_recorder_configuration');
        if (isset($postData['max_try']) && isset($postData['max_recording_time'])) {
            $this->manager->updateConfiguration($config, $postData);
            $msg = $this->get('translator')->trans('config_update_success', [], 'tools');
            $this->get('session')->getFlashBag()->set('success', $msg);
        } else {
            $msg = $this->get('translator')->trans('config_update_error', [], 'tools');
            $this->get('session')->getFlashBag()->set('error', $msg);
        }

        return $this->redirectToRoute('audio_recorder_config_form');
    }
}
