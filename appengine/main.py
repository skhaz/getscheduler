import ipaddress
import socket
from http import HTTPStatus
from io import BytesIO

import pycurl
from flask import Flask, abort, request

app = Flask(__name__)


def _opensocket(purpose, curl_address):
    family, socktype, protocol, address = curl_address
    if ipaddress.ip_address(address[0]).is_private:
        print(f"blocked private address: {address[0]}")
        return pycurl.SOCKET_BAD

    return socket.socket(family, socktype, protocol)


@app.post("/")
def index():
    envelope = request.get_json()

    if not envelope:
        abort(HTTPStatus.BAD_REQUEST)

    print(envelope)

    curl = pycurl.Curl()
    curl.setopt(pycurl.NOSIGNAL, 1)
    curl.setopt(pycurl.PROTOCOLS, pycurl.PROTO_HTTP | pycurl.PROTO_HTTPS)
    curl.setopt(pycurl.OPENSOCKETFUNCTION, _opensocket)
    curl.setopt(pycurl.FOLLOWLOCATION, True)
    curl.setopt(pycurl.MAXREDIRS, 3)
    curl.setopt(pycurl.VERBOSE, 0)

    curl.setopt(pycurl.URL, envelope["url"].encode())
    curl.setopt(pycurl.CUSTOMREQUEST, envelope["method"].upper())
    curl.setopt(pycurl.TIMEOUT, envelope["timeout"])

    buffer = BytesIO()
    curl.setopt(pycurl.WRITEDATA, buffer)

    try:
        curl.perform()
    except pycurl.error as error:
        errcode = error.args[0]
        if errcode == pycurl.E_OPERATION_TIMEDOUT:
            print("connection timed out")
        elif errcode == pycurl.E_COULDNT_RESOLVE_HOST:
            print("could not resolve host")
        elif errcode == pycurl.E_COULDNT_CONNECT:
            print("connection failed")
        elif errcode == pycurl.E_TOO_MANY_REDIRECTS:
            print("too many redirects")
        elif errcode in (pycurl.E_SSL_CONNECT_ERROR, pycurl.E_PEER_FAILED_VERIFICATION):
            print("TLS handshake failed")
    finally:
        status = curl.getinfo(pycurl.RESPONSE_CODE)
        curl.close()

    print(f"{envelope['url']} response code: {status}")

    return (
        "",
        HTTPStatus.NO_CONTENT
        if status == envelope["success"]
        else HTTPStatus.BAD_REQUEST,
    )


@app.get("/_ah/health")
def health():
    return "👌"
