# Instant-Gaming Webscraper

## Compilation

### Création et utilisation du token Github pour la publication

- Se connecter à l'adresse : [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new`)
- Créer un token ayant tout le scope `repo`

- Copier le token puis remplacer `<YOUR_TOKEN_HERE>` par le token et executer la ligne de commande dans un editeur
  PowerShell

```shell
[Environment]::SetEnvironmentVariable("GH_TOKEN","<YOUR_TOKEN_HERE>","User")
```

- Redémarrer le terminal/l'IDE pour prendre en compte les dernières variables d'environnement
