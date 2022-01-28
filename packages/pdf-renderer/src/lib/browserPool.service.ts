import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { LaunchOptions } from "puppeteer";
import { Cluster } from "puppeteer-cluster";
import { TaskFunction } from "puppeteer-cluster/dist/Cluster";

@Injectable()
export class BrowserPool implements OnModuleInit, OnModuleDestroy {
    private cluster?: Cluster<any, any>;

    async onModuleInit() {
        this.cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_PAGE,
            maxConcurrency: 2,
            puppeteerOptions: {
                args: ["--no-sandbox"],
            } as LaunchOptions,
        });
    }

    async onModuleDestroy() {
        if (this.cluster) {
            await this.cluster.idle();
            await this.cluster.close();
        }
    }

    run<TData, TReturn>(task: TaskFunction<TData, TReturn>, data: TData): Promise<TReturn> {
        if (!this.cluster) {
            throw new Error("Cluster has not started yet");
        }

        return this.cluster.execute(data, task);
    }
}
