<?php
// Activer l'affichage des erreurs pour debug (à retirer en production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Headers pour CORS et JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Répondre aux préflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Charger les variables d'environnement (essaie plusieurs chemins)
$candidateEnvPaths = [
    __DIR__ . '/../.env',
    __DIR__ . '/.env'
];

$env_file = null;
foreach ($candidateEnvPaths as $path) {
    if (file_exists($path)) {
        $env_file = $path;
        break;
    }
}

if ($env_file === null) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Fichier de configuration .env introuvable. Chemins testés: ' . implode(', ', $candidateEnvPaths)]);
    exit;
}

$env = parse_ini_file($env_file);
if ($env === false) {
    echo json_encode(['status' => 'error', 'message' => 'Erreur de lecture de la configuration.']);
    exit;
}

// Mode debug GET: retourner info .env sans envoyer d'email
if (isset($_GET['debug']) && $_GET['debug'] == '1' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $configSummary = [
        'SMTP_HOST' => isset($env['SMTP_HOST']),
        'SMTP_PORT' => isset($env['SMTP_PORT']) ? (int)$env['SMTP_PORT'] : null,
        'SMTP_ENCRYPTION' => $env['SMTP_ENCRYPTION'] ?? null,
        'FROM_EMAIL' => isset($env['FROM_EMAIL']),
        'FROM_NAME' => isset($env['FROM_NAME']),
        'TO_EMAIL' => isset($env['TO_EMAIL'])
    ];
    echo json_encode([
        'status' => 'debug',
        'env_path' => $env_file,
        'config_keys_present' => $configSummary
    ]);
    exit;
}

// Valider la présence des clés requises dans .env
$requiredKeys = ['SMTP_HOST','SMTP_USERNAME','SMTP_PASSWORD','SMTP_ENCRYPTION','SMTP_PORT','FROM_EMAIL','FROM_NAME','TO_EMAIL'];
$missingKeys = array_values(array_diff($requiredKeys, array_keys($env)));
if (!empty($missingKeys)) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Clés manquantes dans .env: ' . implode(', ', $missingKeys)]);
    exit;
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Chargement de PHPMailer
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';
require __DIR__ . '/PHPMailer/src/Exception.php';

// Vérifier que la requête est de type POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée.']);
    exit;
}

// Récupérer les données du formulaire
$nom = isset($_POST['nom']) ? trim($_POST['nom']) : '';
$prenom = isset($_POST['prenom']) ? trim($_POST['prenom']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$telephone = isset($_POST['telephone']) ? trim($_POST['telephone']) : '';
$prestation = isset($_POST['prestation']) ? trim($_POST['prestation']) : '';
$description = isset($_POST['description']) ? trim($_POST['description']) : '';
$mentions = isset($_POST['mentions']) ? true : false;

// Validation basique
if (empty($nom) || empty($email) || empty($telephone) || empty($prestation) || !$mentions) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Tous les champs obligatoires ne sont pas remplis.']);
    exit;
}

// Configuration de PHPMailer
$mail = new PHPMailer(true);

try {
    // Paramètres SMTP
    $mail->isSMTP();
    $mail->Host       = $env['SMTP_HOST'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $env['SMTP_USERNAME'];
    $mail->Password   = $env['SMTP_PASSWORD'];
    // Normaliser l'option d'encryptage
    $encryption = strtolower(trim((string)$env['SMTP_ENCRYPTION']));
    if ($encryption === 'tls' || $encryption === 'starttls') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    } elseif ($encryption === 'ssl' || $encryption === 'smtps') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    } else {
        $mail->SMTPSecure = '';
    }
    $mail->Port       = (int)$env['SMTP_PORT'];
    
    // Debug SMTP (à retirer en production)
    $mail->SMTPAutoTLS = true;
    $mail->SMTPDebug = (isset($_GET['debug']) && $_GET['debug'] == '1') ? 2 : 0;  // 0 = off, 1 = client, 2 = client and server
    
    // Encodage
    $mail->CharSet = 'UTF-8';
    // Langue (fichiers présents dans PHPMailer/language)
    $mail->setLanguage('fr', __DIR__ . '/PHPMailer/language/');

    // Expéditeur et destinataire
    // Beaucoup de serveurs exigent que l'expéditeur corresponde au compte authentifié
    $fromEmailConfigured = $env['FROM_EMAIL'];
    $smtpUsernameEmail = $env['SMTP_USERNAME'];
    $mail->setFrom($smtpUsernameEmail, $env['FROM_NAME']);
    $mail->addAddress($env['TO_EMAIL']);
    
    // Email de réponse (celui du client)
    $mail->addReplyTo($email, $nom . ' ' . $prenom);

    // Contenu de l'email
    $mail->isHTML(true);
    $mail->Subject = 'Nouvelle demande de devis - Ulysse Chauffage Sanitaire';
    $mail->Body    = "
        <h1>Nouvelle demande de devis</h1>
        <p><strong>Nom :</strong> $nom</p>
        <p><strong>Prénom :</strong> $prenom</p>
        <p><strong>Email :</strong> $email</p>
        <p><strong>Téléphone :</strong> $telephone</p>
        <p><strong>Type de prestation :</strong> $prestation</p>
        <p><strong>Description :</strong><br>" . nl2br(htmlspecialchars($description)) . "</p>
    ";
    $mail->AltBody = "
        Nouvelle demande de devis
        Nom : $nom
        Prénom : $prenom
        Email : $email
        Téléphone : $telephone
        Type de prestation : $prestation
        Description : $description
    ";

    // Envoi de l'email
    $mail->send();
    $debugData = [];
    if (isset($_GET['debug']) && $_GET['debug'] == '1') {
        $debugData = [
            'env_path' => $env_file,
            'config' => [
                'SMTP_HOST' => $env['SMTP_HOST'] ?? null,
                'SMTP_PORT' => (int)($env['SMTP_PORT'] ?? 0),
                'SMTP_ENCRYPTION' => $env['SMTP_ENCRYPTION'] ?? null,
                'FROM_EMAIL' => $fromEmailConfigured ?? null,
                'FROM_NAME' => $env['FROM_NAME'] ?? null,
                'TO_EMAIL' => $env['TO_EMAIL'] ?? null
            ],
            'from_equals_smtp_username' => strtolower($fromEmailConfigured) === strtolower($smtpUsernameEmail)
        ];
    }
    echo json_encode(['status' => 'success', 'message' => 'Votre demande a été envoyée avec succès !'] + $debugData);
} catch (Exception $e) {
    http_response_code(500);
    $debugData = [];
    if (isset($_GET['debug']) && $_GET['debug'] == '1') {
        $debugData = [
            'env_path' => $env_file,
            'config' => [
                'SMTP_HOST' => $env['SMTP_HOST'] ?? null,
                'SMTP_PORT' => (int)($env['SMTP_PORT'] ?? 0),
                'SMTP_ENCRYPTION' => $env['SMTP_ENCRYPTION'] ?? null,
                'FROM_EMAIL' => $fromEmailConfigured ?? null,
                'FROM_NAME' => $env['FROM_NAME'] ?? null,
                'TO_EMAIL' => $env['TO_EMAIL'] ?? null
            ],
            'from_equals_smtp_username' => strtolower($fromEmailConfigured) === strtolower($smtpUsernameEmail)
        ];
    }
    echo json_encode(['status' => 'error', 'message' => "L'envoi a échoué. Erreur : " . $mail->ErrorInfo] + $debugData);
}
?>
