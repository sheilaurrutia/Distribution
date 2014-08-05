/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

(function () {
    'use strict';

    window.Claroline = window.Claroline || {};
    var translator = window.Translator;
    var routing = window.Routing;
    var common = window.Claroline.Common;
    var modal = window.Claroline.Modal = {
        modalStack: []
    };

    /**
     * Push a modal element and his backdrop in a stack
     *
     * @param element The modal html element
     */
    modal.push = function (element)
    {
        var index = modal.modalStack.length - 1;

        if (index >= 0) {
            var previousModal = modal.modalStack[index];

            if (previousModal.get(0) === $(element).get(0)) {
                return;
            }

            if (!previousModal.hasClass('fullscreen')) {
                previousModal.addClass('parent-hide');
            }
        }

        modal.modalStack.push($(element));

        $('.modal-backdrop:not(.parent-hide)').addClass('parent-hide');
    };

    /**
     * Pop a modal element and his backdrop in a stack
     */
    modal.pop = function ()
    {
        modal.modalStack.pop();

        var index = modal.modalStack.length - 1;

        if (index >= 0) {
            modal.modalStack[index].removeClass('parent-hide');

            $('.modal-backdrop.parent-hide').removeClass('parent-hide');
        }
    };

    /**
     * Hide all open modals.
     */
    modal.hide = function ()
    {
        $('.modal').modal('hide');
    };

    /**
     * Create a new modal that destroys itself when close.
     *
     * @param content The content to put inside this modal (this modal does not contain modal-digalog element)
     */
    modal.create = function (content)
    {
        return common.createElement('div', 'modal fade')
            .html(content)
            .appendTo('body')
            .modal('show')
            .on('hidden.bs.modal', function () {
                $(this).remove();
            });
    };

    /**
     * This function show a new modal with an error message.
     */
    modal.error = function ()
    {
        modal.hide();
        modal.simpleContainer(
            translator.get('home:An error occurred'),
            translator.get('home:Please try again later or check your internet connection')
        );
    };

    /**
     * This function show a complete modal with given title and content.
     *
     * @param title The title of the modal.
     * @param content The content of the modal.
     */
    modal.simpleContainer = function (title, content)
    {
        return modal.create(
            common.createElement('div', 'modal-dialog').html(
                common.createElement('div', 'modal-content').append(
                    common.createElement('div', 'modal-header')
                    .append(common.createElement('button', 'close').html('&times;').attr('data-dismiss', 'modal'))
                    .append(common.createElement('h4', 'modal-title').html(title))
                )
                .append(common.createElement('div', 'modal-body').html(content))
                .append(common.createElement('div', 'modal-footer').html(
                    common.createElement('button', 'btn btn-primary')
                    .html(translator.get('home:Ok'))
                    .attr('data-dismiss', 'modal')
                    )
                )
            )
        );
    };

    /**
     * Show a new modal from a given url, this url must return the entire HTML of the modal-dialog, if you want to
     * show a modal without definding all the HTML you can use simpleContainer function.
     *
     * @param url The url of a modal content.
     * @param action An optional function to execute when modal is showed, this is useful in order to make binds.
     */
    modal.fromUrl = function (url, action)
    {
        $.ajax(url)
        .done(function (data) {
            var element = modal.create(data);
            if (typeof(action) === 'function') {
                action(element);
            }
        })
        .error(function () {
            modal.error();
        });
    };

    /**
     * Show a new modal from a given route, this route must render the entire HTML of the modal-dialog, if you want to
     * show a modal without definding all the HTML you can use simpleContainer function.
     *
     * @param route The route of a modal content.
     * @param variables The route.
     * @param action A function to execute when modal is showed, this is useful in order to make binds.
     *
     * Example: modal.fromRoute('my_route', {'myVariable': 'myValue'});
     */
    modal.fromRoute = function (route, variables, action)
    {
        modal.fromUrl(routing.generate(route, variables), action);
    };

    /** events **/

    $('body').on({
        'show.bs.modal': function () {
            modal.push(this);
        },
        'hide.bs.modal': function () {
            modal.pop();
        }
    }, '.modal');

}());
