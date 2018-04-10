<?php
if ($_POST) {
  include 'libs/mail-handler.php';

  if (!isset($_POST['pdn-agreement']) || $_POST['pdn-agreement'] !== 'yes') {
    throwError('Пожалуйста, подтвердите своё согласие на обработку персональных данных!');
  } else {
    $subject = "Заявка на звонок | {$_SERVER['HTTP_HOST']}";
    $letterBody = "<h4>Это письмо отправлено с формы на главной странице</h4>
      <p>Имя отправителя: <em>{$_POST['name']}</em></p>
      <p>E-Mail отправителя: <em>{$_POST['email']}</em></p>
      <p>Номер телефона отправителя: <em>{$_POST['phone']}</em></p>";

    $email = 'help@topsite.studio';

    if (!$letterBody) throwError("Произошла ошибка при отправке письма! Код ошибки: 1.");
    if (!$letterBody) throwError('Вы зaпoлнили нe всe пoля!');

    $emailgo= new TEmail;
    $emailgo->from_email= 'no-reply';
    $emailgo->from_name= $_SERVER['HTTP_HOST'];
    $emailgo->to_email= $email;
    $emailgo->to_name= $name;
    $emailgo->subject= $subject;
    $emailgo->body= $letterBody;
    $emailgo->send();
    $json['error'] = 0;
    echo json_encode($json);
  }
} else {
  echo '<h1>Ошибка доступа!</h1>';
}
?>
