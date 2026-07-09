FROM quay.io/strimzi/kafka:1.1.0-kafka-4.3.0

USER root

RUN mkdir -p /opt/kafka/plugins/debezium-postgres

ADD https://repo1.maven.org/maven2/io/debezium/debezium-connector-postgres/3.2.1.Final/debezium-connector-postgres-3.2.1.Final-plugin.zip /tmp/plugin.zip

RUN unzip /tmp/plugin.zip -d /opt/kafka/plugins/debezium-postgres \
 && rm /tmp/plugin.zip

USER 1001 