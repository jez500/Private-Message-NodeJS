<?php

namespace Drupal\private_message_messenger_nodejs\Form;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityTypeManager;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\private_message_messenger\MessengerHelper;

/**
 * Defines the configuration form for the private message nodejs module.
 */
class ConfigForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'private_message_messenger_nodejs_config_form';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'private_message_messenger_nodejs.settings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('private_message_messenger_nodejs.settings');

    $form['notification_type'] = [
      '#type' => 'select',
      '#title' => t('Type of notification'),
      '#options' => [
        '' => $this->t('No notifications'),
        'jgrowl' => $this->t('In-browser (jGrowl) notifications'),
        'native' => $this->t('Native OS notifications'),
      ],
      '#default_value' => $config->get('notification_type'),
      '#description' => t(
        'The type of notification to show when a new message is received.
        In-browser notifications require the jGrowl library to be available. 
        Native OS notifications require a modern browser that supports the 
        Notification API.'),
    ];

    $time = $config->get('notification_time');
    $form['notification_time'] = [
      '#type' => 'number',
      '#title' => t('Notification time'),
      '#default_value' => !is_null($time) ? $time : 5,
      '#min' => 0,
      '#description' => t(
        'How long (in seconds) should a notification display for.'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->config('private_message_messenger_nodejs.settings');

    $config
      ->set('notification_type', (string) $form_state->getValue('notification_type'))
      ->set('notification_time', (int) $form_state->getValue('notification_time'))
      ->save();

    parent::submitForm($form, $form_state);
  }

}
