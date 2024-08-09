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
          ];
        };
   };
}
