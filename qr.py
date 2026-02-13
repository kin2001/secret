
import pathlib

import qrcode


def main() -> None:
  url = "https://kin2001.github.io/secret/"
  out_path = pathlib.Path(__file__).with_name("secret-qr.png")
  img = qrcode.make(url)
  img.save(out_path)
  print(f"Saved QR for {url} -> {out_path.resolve()}")


if __name__ == "__main__":
  main()
