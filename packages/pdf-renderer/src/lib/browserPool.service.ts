import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common"
import { Cluster } from "puppeteer-cluster"
import { TaskFunction } from "puppeteer-cluster/dist/Cluster"
import { createJsonLogger } from "@leancodepl/logger"
import { pdfRendererLoggerSymbol } from "./logger"

@Injectable()
export class BrowserPool implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(pdfRendererLoggerSymbol) private readonly logger: ReturnType<typeof createJsonLogger>) {}

  private cluster?: Cluster

  async onModuleInit() {
    this.logger.debug("BrowserPool: Starting browser cluster")
    this.cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 2,
      puppeteerOptions: {
        headless: true,
        args: ["--no-sandbox"],
      },
    })
    this.logger.debug("BrowserPool: Browser cluster ready")
  }

  async onModuleDestroy() {
    if (this.cluster) {
      this.logger.debug("BrowserPool: Closing browser cluster")
      // It is recommended to run idle() before close(), but it
      // for some reason takes a lot of time and it doesn't seem
      // to be necessary
      // await this.cluster.idle();
      await this.cluster.close()
    }
  }

  run<TData, TReturn>(task: TaskFunction<TData, TReturn>, data: TData): Promise<TReturn> {
    if (!this.cluster) {
      this.logger.error("BrowserPool: Cluster has not started yet")
      throw new Error("Cluster has not started yet")
    }

    return this.cluster.execute(data, task)
  }
}
