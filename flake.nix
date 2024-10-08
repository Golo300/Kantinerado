# flake.nix
{
  description = "Fullstack application with Java Spring Boot and Angular";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  };

  outputs = { self, nixpkgs}: 
    let pkgs = nixpkgs.legacyPackages.x86_64-linux;
    in {

      devShell.x86_64-linux =
        pkgs.mkShell { buildInputs = 
          [         
            pkgs.jdk17
            pkgs.gradle
            pkgs.nodejs
            pkgs.cypress
            pkgs.chromedriver
            pkgs.geckodriver
            pkgs.selenium-server-standalone
          ];
          shellHook = ''
            export NPM_CONFIG_PREFIX="$out"
            
            # Entferne den Link, falls vorhanden
            rm -f $out/bin/ng

            npm install -g @angular/cli
            mkdir -p $out/bin
            ln -s $out/lib/node_modules/@angular/cli/bin/ng $out/bin/ng

            # Frontend
            cd angular-frontend
            npm install
            export NODE_OPTIONS=--openssl-legacy-provider
            echo ../outputs/out/bin/ng serve

            export CYPRESS_INSTALL_BINARY=0
            export CYPRESS_RUN_BINARY=${pkgs.cypress}/bin/Cypress

            '';
        };
   };
}
