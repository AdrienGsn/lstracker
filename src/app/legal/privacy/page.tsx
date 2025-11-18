import { Metadata } from "next";

import {
	Layout,
	LayoutContent,
	LayoutDescription,
	LayoutHeader,
	LayoutTitle,
} from "@/components/page/layout";
import type { PageParams } from "@/types/next";

export const metadata: Metadata = {
	title: "Politique de confidentialité",
};

export default async function RoutePage(props: PageParams) {
	return (
		<Layout>
			<LayoutHeader>
				<LayoutTitle>Privacy Policy</LayoutTitle>
				<LayoutDescription>
					Please read the following privacy policy carefully before
					using our platform.
				</LayoutDescription>
			</LayoutHeader>
			<LayoutContent>
				Politique de Confidentialité — LSTracker Date d’entrée en
				vigueur : 02/11/2025 1. Introduction Cette politique explique
				quelles données nous collectons, pourquoi, comment nous les
				utilisons, et les droits dont vous disposez. Elle s’applique au
				site LSTracker et au Bot Discord associé. 2. Responsable de
				traitement Responsable : ADDevelopment 3. Données collectées
				Selon votre utilisation, nous pouvons collecter : 3.1. Données
				d’identification et de compte Email (si inscription par email),
				pseudo, mot de passe (hashé), avatar. Si vous utilisez OAuth via
				Discord : identifiant Discord (user ID), pseudo, avatar,
				éventuellement serveur(s) où le Bot est présent (server ID), et
				rôles si nécessaire pour les fonctionnalités. 3.2. Données
				techniques / de navigation Adresse IP (anonymisation possible),
				type de navigateur, système d’exploitation, pages visitées,
				horodatage, logs de serveur, cookies. 3.3. Données de contenu
				Contenu que vous publiez sur la carte (marqueurs, commentaires,
				images) et, selon les fonctionnalités du Bot, messages ou
				interactions explicitement transmises. 4. Finalités du
				traitement & bases légales Fournir et maintenir le Service
				(exécution du contrat / intérêts légitimes). Gestion des comptes
				et authentification (exécution du contrat). Amélioration du
				Service via analytics (intérêt légitime ou consentement).
				Sécurité et prévention des fraudes (intérêt légitime).
				Communications utilisateurs (exécution du contrat /
				consentement). Respect des obligations légales (conformité
				légale). 5. Cookies et technologies similaires Nous utilisons
				des cookies pour : authentifier les sessions, stocker des
				préférences, analytics (ex. Google Analytics ou alternatives) —
				possibilité d’opt-out via paramètres navigateur ou lien de
				désactivation si disponible. 6. Partage et sous-traitants Nous
				pouvons partager des données avec : Fournisseurs d’hébergement
				(logs, sauvegardes) ; Plateformes d’analytics ; Services tiers
				utilisés (ex. Discord pour OAuth, services de notifications) ;
				Autorités compétentes si requis par la loi. Nous exigeons
				contractuellement que ces prestataires respectent la
				confidentialité et la sécurité des données. 7. Transferts
				internationaux Si des fournisseurs sont hors UE/EEE, nous
				mettons en place des garanties appropriées (clauses
				contractuelles standard, etc.). Contactez-nous pour plus de
				détails. 8. Conservation des données Données de compte : tant
				que le compte existe + période additionnelle pour obligations
				légales (ex. 1 à 5 ans selon juridiction). Logs techniques :
				conservés [ex. 30–90 jours] sauf nécessité probante (sécurité,
				fraude). Contenu utilisateur : conservé tant que vous l’avez
				publié sauf suppression demandée ou violation. (Remplace les
				périodes ci-dessus par ta politique réelle.) 9. Sécurité Nous
				appliquons des mesures techniques et organisationnelles
				raisonnables (chiffrement, accès restreint, sauvegardes) mais
				aucun système n’est infaillible. 10. Vos droits (RGPD / lois
				similaires) Selon votre résidence, vous pouvez demander : accès
				à vos données, rectification, effacement (« droit à l’oubli »),
				restriction du traitement, opposition au traitement, portabilité
				des données, retirer votre consentement (lorsqu’il est la base),
				porter plainte auprès d’une autorité de protection des données.
				Pour exercer ces droits : contactez [email@example.com ]. Nous
				pouvons demander une preuve d’identité raisonnable. 11. Données
				des mineurs Le Service ne s’adresse pas aux mineurs de moins de
				16 ans (ou 13 selon ton pays — adapte). Nous ne collectons pas
				sciemment des données personnelles de mineurs. Si tu découvres
				qu’un mineur a fourni des données, contacte-nous pour
				suppression. 12. Modifications de la Politique Nous pouvons
				mettre à jour cette politique ; la date d’entrée en vigueur sera
				modifiée. Les changements importants seront communiqués. 13.
				Intégration avec Discord & vérification du Bot Lors de
				l’utilisation du Bot via OAuth2, Discord est le
				contrôleur/processeur tiers pour certaines données. Les
				informations demandées par Discord pour la vérification du Bot
				(p. ex. preuves d’identité de l’application, description des
				permissions) peuvent être fournies à Discord selon leurs
				procédures. Le Bot n’extrait pas de données privées au-delà des
				permissions demandées sans votre accord explicite. Si le Bot
				collecte des messages ou logs, cela sera clairement indiqué et
				vous pourrez opter pour la désactivation de certaines
				fonctionnalités.
			</LayoutContent>
		</Layout>
	);
}
