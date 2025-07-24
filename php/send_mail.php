<?php
// Script d'envoi de mail pour le formulaire de devis
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

function sanitize($data) {
  return htmlspecialchars(stripslashes(trim($data)));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $nom = sanitize($_POST['nom'] ?? '');
  $email = sanitize($_POST['email'] ?? '');
  $telephone = sanitize($_POST['telephone'] ?? '');
  $prestation = sanitize($_POST['prestation'] ?? '');
  $description = sanitize($_POST['description'] ?? '');
  $budget = sanitize($_POST['budget'] ?? '');

  if (!$nom || !$email || !$telephone || !$prestation || !$description) {
    echo 'Veuillez remplir tous les champs obligatoires.';
    exit;
  }

  $mail = new PHPMailer(true);
  try {
    // Config SMTP Ionos
    $mail->isSMTP();
    $mail->Host = 'smtp.ionos.fr';
    $mail->SMTPAuth = true;
    $mail->Username = 'VOTRE_EMAIL@votre-domaine.fr'; // À personnaliser
    $mail->Password = 'VOTRE_MOT_DE_PASSE'; // À personnaliser
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->CharSet = 'UTF-8';

    $mail->setFrom('VOTRE_EMAIL@votre-domaine.fr', 'Ulysse Chauffage Sanitaire');
    $mail->addAddress('VOTRE_EMAIL@votre-domaine.fr');
    $mail->addReplyTo($email, $nom);

    $mail->isHTML(true);
    $mail->Subject = 'Nouvelle demande de devis depuis le site';
    $mail->Body = "<h2>Nouvelle demande de devis</h2>"
      ."<b>Nom :</b> $nom<br>"
      ."<b>Email :</b> $email<br>"
      ."<b>Téléphone :</b> $telephone<br>"
      ."<b>Prestation :</b> $prestation<br>"
      ."<b>Description :</b> $description<br>"
      ."<b>Budget :</b> $budget €";

    $mail->AltBody = "Nom: $nom\nEmail: $email\nTéléphone: $telephone\nPrestation: $prestation\nDescription: $description\nBudget: $budget €";

    $mail->send();
    echo 'Votre demande a bien été envoyée. Merci !';
  } catch (Exception $e) {
    echo "Erreur lors de l'envoi : {$mail->ErrorInfo}";
  }
} else {
  echo 'Méthode non autorisée.';
} 