<?php
require_once __DIR__ . '/PHPMailer/src/Exception.php';
require_once __DIR__ . '/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

// Fonction pour charger les variables d'environnement
function loadEnv($file) {
    $env = [];
    if (file_exists($file)) {
        $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos($line, '#') === 0) continue; // Ignorer les commentaires
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $env[trim($key)] = trim($value);
            }
        }
    }
    return $env;
}

// Charger la configuration depuis le fichier .env
$env = loadEnv(__DIR__ . '/../.env');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupération des données du formulaire
    $nom = $_POST['nom'] ?? '';
    $prenom = $_POST['prenom'] ?? '';
    $email = $_POST['email'] ?? '';
    $telephone = $_POST['telephone'] ?? '';
    $prestation = $_POST['prestation'] ?? '';
    $description = $_POST['description'] ?? '';
    $budget = $_POST['budget'] ?? '';
    
    // Validation basique
    if (empty($nom) || empty($email) || empty($telephone) || empty($prestation)) {
        echo json_encode([
            'success' => false,
            'message' => 'Veuillez remplir tous les champs obligatoires.'
        ]);
        exit;
    }
    
    // Validation de l'email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'message' => 'Adresse email invalide.'
        ]);
        exit;
    }
    
    try {
        // Configuration PHPMailer
        $mail = new PHPMailer(true);
        
        // Configuration SMTP
        $mail->isSMTP();
        $mail->Host = $env['SMTP_HOST'] ?? 'smtp.ionos.fr';
        $mail->SMTPAuth = true;
        $mail->Username = $env['SMTP_USERNAME'] ?? '';
        $mail->Password = $env['SMTP_PASSWORD'] ?? '';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = $env['SMTP_PORT'] ?? 465;
        $mail->CharSet = 'UTF-8';
        
        // Expéditeur
        $mail->setFrom($env['FROM_EMAIL'] ?? '', $env['FROM_NAME'] ?? 'Ulysse Chauffage Sanitaire');
        
        // Destinataires - gestion de plusieurs emails séparés par des virgules
        $toEmails = $env['TO_EMAIL'] ?? '';
        if (!empty($toEmails)) {
            $emailList = explode(',', $toEmails);
            foreach ($emailList as $emailAddress) {
                $emailAddress = trim($emailAddress);
                if (!empty($emailAddress) && filter_var($emailAddress, FILTER_VALIDATE_EMAIL)) {
                    $mail->addAddress($emailAddress);
                }
            }
        }
        
        // Email de réponse
        $mail->addReplyTo($email, $nom . ' ' . $prenom);
        
        // Contenu de l'email
        $mail->isHTML(true);
        $mail->Subject = 'Nouvelle demande de devis - ' . $prestation;
        
        $htmlBody = "
        <html>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
                <h2 style='color: #1c3f8c; border-bottom: 2px solid #eda407; padding-bottom: 10px;'>
                    Nouvelle demande de devis - Ulysse Chauffage Sanitaire
                </h2>
                
                <div style='background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                    <h3 style='color: #1c3f8c; margin-top: 0;'>Informations client :</h3>
                    <p><strong>Nom :</strong> $nom</p>
                    <p><strong>Prénom :</strong> $prenom</p>
                    <p><strong>Email :</strong> <a href='mailto:$email'>$email</a></p>
                    <p><strong>Téléphone :</strong> <a href='tel:$telephone'>$telephone</a></p>
                </div>
                
                <div style='background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                    <h3 style='color: #1c3f8c; margin-top: 0;'>Détails de la demande :</h3>
                    <p><strong>Type de prestation :</strong> <span style='color: #eda407; font-weight: bold;'>$prestation</span></p>
                    <p><strong>Budget estimé :</strong> <span style='color: #eda407; font-weight: bold;'>$budget €</span></p>
                    <p><strong>Description du projet :</strong></p>
                    <div style='background-color: white; padding: 10px; border-left: 4px solid #eda407; margin-top: 10px;'>
                        " . (!empty($description) ? nl2br(htmlspecialchars($description)) : '<em>Aucune description fournie</em>') . "
                    </div>
                </div>
                
                <div style='background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                    <h3 style='color: #1c3f8c; margin-top: 0;'>Actions suggérées :</h3>
                    <ul>
                        <li>Contacter le client par téléphone : <strong>$telephone</strong></li>
                        <li>Répondre par email : <strong>$email</strong></li>
                        <li>Planifier une visite si nécessaire</li>
                        <li>Préparer un devis détaillé</li>
                    </ul>
                </div>
                
                <div style='text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;'>
                    <p style='font-size: 12px; color: #666;'>
                        Email envoyé automatiquement depuis le site web Ulysse Chauffage Sanitaire<br>
                        Date : " . date('d/m/Y à H:i:s') . "
                    </p>
                </div>
            </div>
        </body>
        </html>";
        
        $mail->Body = $htmlBody;
        
        // Version texte alternative
        $textBody = "Nouvelle demande de devis - Ulysse Chauffage Sanitaire\n\n";
        $textBody .= "INFORMATIONS CLIENT :\n";
        $textBody .= "Nom : $nom\n";
        $textBody .= "Prénom : $prenom\n";
        $textBody .= "Email : $email\n";
        $textBody .= "Téléphone : $telephone\n\n";
        $textBody .= "DÉTAILS DE LA DEMANDE :\n";
        $textBody .= "Type de prestation : $prestation\n";
        $textBody .= "Budget estimé : $budget €\n";
        $textBody .= "Description du projet :\n" . (!empty($description) ? $description : 'Aucune description fournie') . "\n\n";
        $textBody .= "Date : " . date('d/m/Y à H:i:s');
        
        $mail->AltBody = $textBody;
        
        // Envoi de l'email
        $mail->send();
        
        // Log des données dans un fichier pour vérification
        $logFile = __DIR__ . '/form_submissions.log';
        $logEntry = date('Y-m-d H:i:s') . " - Email envoyé avec succès:\n";
        $logEntry .= "Nom: $nom\n";
        $logEntry .= "Prénom: $prenom\n";
        $logEntry .= "Email: $email\n";
        $logEntry .= "Téléphone: $telephone\n";
        $logEntry .= "Prestation: $prestation\n";
        $logEntry .= "Description: $description\n";
        $logEntry .= "Budget: $budget\n";
        $logEntry .= "Destinataires: " . ($env['TO_EMAIL'] ?? '') . "\n";
        $logEntry .= "---\n\n";
        
        file_put_contents($logFile, $logEntry, FILE_APPEND);
        
        echo json_encode([
            'success' => true,
            'message' => 'Votre demande de devis a été envoyée avec succès ! Nous vous recontacterons rapidement.'
        ]);
        
    } catch (Exception $e) {
        // Log de l'erreur
        $errorLog = __DIR__ . '/email_errors.log';
        $errorEntry = date('Y-m-d H:i:s') . " - Erreur d'envoi d'email:\n";
        $errorEntry .= "Erreur: " . $mail->ErrorInfo . "\n";
        $errorEntry .= "Exception: " . $e->getMessage() . "\n";
        $errorEntry .= "---\n\n";
        
        file_put_contents($errorLog, $errorEntry, FILE_APPEND);
        
        echo json_encode([
            'success' => false,
            'message' => 'Erreur lors de l\'envoi de votre demande. Veuillez réessayer ou nous contacter directement.'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée.'
    ]);
}
?>
