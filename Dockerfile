# Use specific LTS Node.js build on slim LTS Debian OS
FROM node:24.11.0-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

# Indicate to observing Node.js modules that this is a production environment
ENV NODE_ENV=production

# Create reelyactive user to run Pareto Anywhere
RUN useradd -m -s /bin/bash reelyactive
USER reelyactive

# Copy repo files as reelyactive user to /home/reelyactive/pareto-anywhere
WORKDIR /home/reelyactive/pareto-anywhere
COPY --chown=reelyactive . /home/reelyactive/pareto-anywhere

# Install the production package dependencies
RUN npm install --omit=dev

# Prepare the local folders, and ESMapDB databases, to accept reads and writes
RUN mkdir -p data/images data/records && \
    mkdir -p data/associations data/features data/stories && \
    touch data/associations/LOCK data/features/LOCK data/stories/LOCK

# Expose port 3001 for web, 50001 for UDP raddecs, 50000 for UDP reel packets
EXPOSE 3001/tcp 50000/udp 50001/udp

# Run Pareto Anywhere using the standard startup script
CMD ["dumb-init","node","bin/pareto-anywhere"]