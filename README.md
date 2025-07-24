# Ulysse Rénovation — Site vitrine

## Structure du projet

- `index.html` : page d'accueil
- `src/` : pages internes (prestations, galerie, qui sommes-nous)
- `assets/style.css` : styles CSS
- `images/` : images du site (partenaires, galerie)
- `php/send_mail.php` : script d'envoi de mail pour le formulaire de devis
- `php/PHPMailer/` : bibliothèque PHPMailer (à télécharger)

## Déploiement

1. **Téléchargez PHPMailer**
   - Rendez-vous sur [https://github.com/PHPMailer/PHPMailer](https://github.com/PHPMailer/PHPMailer)
   - Copiez les fichiers `PHPMailer.php`, `SMTP.php`, `Exception.php` dans `php/PHPMailer/src/`

2. **Configuration de l'envoi de mail**
   - Ouvrez `php/send_mail.php`
   - Remplacez :
     - `VOTRE_EMAIL@votre-domaine.fr` par votre adresse Ionos
     - `VOTRE_MOT_DE_PASSE` par le mot de passe SMTP
   - Vérifiez que l'adresse d'expédition et de réception est correcte

3. **Hébergement**
   - Déposez tous les fichiers sur votre hébergement web (Ionos ou autre)
   - Assurez-vous que PHP est activé pour le dossier `php/`

4. **Personnalisation**
   - Modifiez les textes, horaires, adresses, images selon vos besoins
   - Les images de la galerie et des partenaires sont à remplacer par vos propres visuels

## Maintenance

- Le code est commenté et organisé pour faciliter la maintenance
- Pour toute évolution, modifiez ou ajoutez des fichiers dans `src/` ou `assets/`

## Conseils SEO

- Complétez les balises `<title>` et `<meta description>` pour chaque page
- Ajoutez des images optimisées (taille et nom de fichier descriptif)
- Utilisez des URLs propres (évitez les espaces et caractères spéciaux)

---

Pour toute question ou assistance, contactez l'équipe Ulysse Rénovation. 